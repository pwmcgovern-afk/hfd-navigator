import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { prisma } from '@/lib/db'

// Simple in-memory rate limiter (per-IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

// Cached resource data (refreshes every hour)
interface CachedResource {
  id: string
  name: string
  nameEs: string | null
  organization: string | null
  description: string
  descriptionEs: string | null
  categories: string[]
  phone: string | null
  address: string | null
  hours: string | null
  website: string | null
  // Lowercase searchable text for keyword matching
  searchText: string
}

let cachedResources: CachedResource[] | null = null
let cacheExpiry = 0

async function getAllResources(): Promise<CachedResource[]> {
  const now = Date.now()
  if (cachedResources && now < cacheExpiry) {
    return cachedResources
  }

  const resources = await prisma.resource.findMany({
    select: {
      id: true,
      name: true,
      nameEs: true,
      organization: true,
      description: true,
      descriptionEs: true,
      categories: true,
      phone: true,
      address: true,
      hours: true,
      website: true,
    },
  })

  cachedResources = resources.map(r => ({
    ...r,
    searchText: [
      r.name,
      r.nameEs,
      r.organization,
      r.description,
      r.descriptionEs,
      ...r.categories,
    ].filter(Boolean).join(' ').toLowerCase()
  }))

  cacheExpiry = now + 60 * 60 * 1000
  return cachedResources
}

// Select resources most relevant to the user's query
function selectRelevantResources(
  query: string,
  allResources: CachedResource[],
  maxResults: number = 25
): CachedResource[] {
  const queryWords = query.toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)

  if (queryWords.length === 0) {
    // No meaningful keywords — return a diverse sample
    return allResources.slice(0, maxResults)
  }

  // Score each resource by keyword match count
  const scored = allResources.map(resource => {
    let score = 0
    for (const word of queryWords) {
      if (resource.searchText.includes(word)) {
        score++
        // Boost for name/category matches
        if (resource.name.toLowerCase().includes(word)) score += 2
        if (resource.categories.some(c => c.includes(word))) score += 2
      }
    }
    return { resource, score }
  })

  // Return top matches (scored > 0), plus a few extras for breadth
  const matches = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.resource)

  // If very few matches, pad with some general resources
  if (matches.length < 5) {
    const matchIds = new Set(matches.map(m => m.id))
    const extras = allResources
      .filter(r => !matchIds.has(r.id))
      .slice(0, 10)
    return [...matches, ...extras].slice(0, maxResults)
  }

  return matches
}

function formatResourceForPrompt(r: CachedResource): string {
  return [
    r.id,
    r.name,
    r.nameEs || '',
    r.organization || '',
    r.categories.join(','),
    r.description.slice(0, 200),
    (r.descriptionEs || '').slice(0, 200),
    r.phone || '',
    r.address || '',
    r.hours || '',
  ].join('|')
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { messages, language = 'en' } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (language !== 'en' && language !== 'es') {
      return new Response(
        JSON.stringify({ error: 'Invalid language' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const recentMessages = messages.slice(-20)

    // Extract the user's latest query for keyword matching
    const lastUserMessage = [...recentMessages]
      .reverse()
      .find(m => m.role === 'user')?.content || ''

    const allResources = await getAllResources()
    const relevantResources = selectRelevantResources(lastUserMessage, allResources)
    const resourceList = relevantResources.map(formatResourceForPrompt).join('\n')

    const isSpanish = language === 'es'

    const systemPrompt = `You are a helpful assistant for Hartford Navigator, a social services directory for Hartford, CT residents.

${isSpanish ? 'IMPORTANT: Respond in Spanish. The user has selected Spanish as their language.' : 'Respond in English.'}

RULES:
- Only recommend resources from the database below. Never invent resources.
- Always link to resources using this format: [Resource Name](/resources/RESOURCE_ID)
- Include phone numbers when available.
- For crisis situations (suicidal thoughts, immediate danger), direct to 988 Suicide & Crisis Lifeline or 911.
- Keep responses concise: 2-4 short paragraphs.
- If no matching resource exists, suggest calling 211 for additional help.
- Be warm, direct, and non-judgmental.

RESOURCE DATABASE (${relevantResources.length} most relevant of ${allResources.length} total — id|name|nameEs|org|categories|description|descriptionEs|phone|address|hours):
${resourceList}`

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: recentMessages,
      maxTokens: 1024,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
