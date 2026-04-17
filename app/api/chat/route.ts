import { streamText, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import * as Sentry from '@sentry/nextjs'
import { searchResources, getResourceDetails } from '@/lib/search'

// Per-IP rate limiter (resets on cold start; in-memory is fine for portfolio
// scale — swap for Upstash if traffic ever justifies the dependency).
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

// System prompt is intentionally short so the model leans on tool calls
// rather than a giant in-context dump. The block is marked for ephemeral
// caching (5-min TTL) so multi-turn conversations and bursty traffic only
// pay full input price on the first request.
function buildSystemPrompt(language: 'en' | 'es') {
  return `You are the Hartford Navigator assistant, helping residents find free or low-cost social services in Hartford, CT.

${language === 'es'
  ? 'Respond ONLY in Spanish. The user has selected Spanish.'
  : 'Respond in English unless the user writes in Spanish.'}

How you work:
- Use the search_resources tool to find resources that match the user's situation. Search broadly first, then narrow if needed.
- Use the get_resource_details tool when you want phone, address, or hours for a resource you plan to recommend.
- NEVER invent or guess a resource that didn't come back from a tool call. If nothing fits, say so plainly and suggest calling 211.
- Always link to recommended resources with this exact markdown: [Resource Name](/resources/RESOURCE_ID)
- Keep responses short: 2–4 short paragraphs. Lead with the most relevant 1–2 resources, then briefly mention alternatives if helpful.
- For crisis situations (suicidal thoughts, immediate danger, domestic violence in progress), direct to 988 or 911 first, before searching.
- Be warm, direct, non-judgmental. Plain language — no jargon.`
}

const MODEL_ID = 'claude-sonnet-4-6'

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
    const systemPrompt = buildSystemPrompt(language)
    const startedAt = Date.now()

    const tools = {
      search_resources: tool({
        description:
          'Search the Hartford Navigator directory for social-service resources. Use a free-text query describing the user\'s need (e.g. "rental assistance late on rent", "free dental clinic", "food pantry near downtown"). Optionally narrow by category. Returns matching resources with id, name, snippet, and match score. Call this first before recommending anything.',
        parameters: z.object({
          query: z
            .string()
            .optional()
            .describe('Natural language search terms. Omit if filtering only by category.'),
          category: z
            .enum([
              'housing',
              'food',
              'cash',
              'harm-reduction',
              'healthcare',
              'mental-health',
              'employment',
              'childcare',
              'legal',
              'transportation',
              'utilities',
              'immigration',
            ])
            .optional()
            .describe('Restrict results to a single category slug.'),
          limit: z
            .number()
            .int()
            .min(1)
            .max(15)
            .optional()
            .describe('Max number of results (default 10).'),
        }),
        execute: async ({ query, category, limit }) => {
          const hits = await searchResources({ query, category, limit })
          return {
            count: hits.length,
            results: hits,
          }
        },
      }),

      get_resource_details: tool({
        description:
          'Fetch the full record for a single resource by id. Use this to look up phone, address, hours, or website before recommending a resource to the user.',
        parameters: z.object({
          id: z.string().describe('Resource UUID returned from search_resources.'),
        }),
        execute: async ({ id }) => {
          const detail = await getResourceDetails(id)
          if (!detail) {
            return { error: 'Resource not found.' }
          }
          return detail
        },
      }),
    }

    // Anthropic prompt caching: tool defs are auto-cached when any system or
    // message block is marked, so we attach cacheControl to the system block
    // (system prompt + tools change rarely). On a 5-min window this drops
    // input cost ~90% for follow-up turns.
    const result = streamText({
      model: anthropic(MODEL_ID),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        },
        ...recentMessages,
      ],
      tools,
      maxSteps: 5,
      maxTokens: 1024,
      onFinish: ({ usage, finishReason, steps }) => {
        const ms = Date.now() - startedAt
        const toolCalls = steps?.reduce((n, s) => n + (s.toolCalls?.length || 0), 0) ?? 0
        console.log(
          JSON.stringify({
            event: 'chat_complete',
            ms,
            language,
            messageCount: recentMessages.length,
            toolCalls,
            finishReason,
            inputTokens: usage?.promptTokens,
            outputTokens: usage?.completionTokens,
          })
        )
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'api/chat' } })
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
