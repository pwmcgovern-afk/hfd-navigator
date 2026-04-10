import { prisma } from './db'

const API_BASE = 'https://api.211.org/search/v1'

const CATEGORY_MAP: Record<string, string[]> = {
  'BH': ['housing'], 'BH-1800': ['housing'], 'BH-3000': ['housing'], 'BH-8600': ['housing'],
  'BD': ['food'], 'BD-1800': ['food'], 'BD-5000': ['food'], 'BD-5000.6500': ['food'],
  'LF': ['healthcare'], 'LF-1000': ['healthcare'], 'LF-4500': ['healthcare'],
  'RF': ['mental-health'],
  'RX': ['harm-reduction'],
  'ND': ['employment'], 'ND-2000': ['employment'],
  'FT': ['legal'],
  'BV': ['utilities'],
  'BT': ['transportation'],
  'PH': ['childcare'],
  'FT-3200': ['immigration'],
}

export const SEARCH_TERMS = [
  'food pantry', 'soup kitchen', 'emergency shelter', 'homeless services',
  'housing assistance', 'rent assistance', 'utility assistance', 'mental health',
  'substance abuse treatment', 'addiction recovery', 'job training',
  'employment services', 'legal aid', 'immigration services', 'domestic violence',
  'childcare', 'health clinic', 'free clinic', 'medication assistance',
  'transportation assistance',
]

interface Service211 {
  id: string
  name: string
  description: string
  organization?: { name: string }
  location?: {
    address1?: string; city?: string; state?: string; postalCode?: string
    latitude?: number; longitude?: number
  }
  phones?: Array<{ number: string }>
  url?: string
  email?: string
  hours?: string
  taxonomies?: Array<{ code: string; name: string }>
  applicationProcess?: string
}

function mapCategories(taxonomies: Array<{ code: string; name: string }> | undefined): string[] {
  if (!taxonomies) return ['healthcare']
  const categories = new Set<string>()
  for (const tax of taxonomies) {
    if (CATEGORY_MAP[tax.code]) {
      CATEGORY_MAP[tax.code].forEach(cat => categories.add(cat))
    } else {
      const parentCode = tax.code.substring(0, 2)
      if (CATEGORY_MAP[parentCode]) {
        CATEGORY_MAP[parentCode].forEach(cat => categories.add(cat))
      }
    }
  }
  if (categories.size === 0) categories.add('healthcare')
  return Array.from(categories)
}

async function searchServices(apiKey: string, query: string): Promise<Service211[]> {
  const params = new URLSearchParams({
    searchTerms: query, location: 'Hartford, CT', distance: '10', top: '100',
  })

  const response = await fetch(`${API_BASE}/search?${params}`, {
    headers: { 'Ocp-Apim-Subscription-Key': apiKey, 'Accept': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`211 API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { results?: Service211[] }
  return data.results || []
}

export interface ImportResult {
  added: number
  skipped: number
  errors: string[]
}

export async function runImport(apiKey: string): Promise<ImportResult> {
  let added = 0
  let skipped = 0
  const errors: string[] = []

  for (const term of SEARCH_TERMS) {
    try {
      const services = await searchServices(apiKey, term)

      for (const service of services) {
        const existing = await prisma.resource.findFirst({
          where: { OR: [{ name: service.name }, { sourceId: service.id, source: '211' }] },
        })

        if (existing) {
          skipped++
          continue
        }

        await prisma.resource.create({
          data: {
            name: service.name,
            organization: service.organization?.name || null,
            description: service.description || 'Contact for more information.',
            categories: mapCategories(service.taxonomies),
            address: service.location?.address1 || null,
            city: service.location?.city || 'Hartford',
            state: service.location?.state || 'CT',
            zip: service.location?.postalCode || null,
            latitude: service.location?.latitude || null,
            longitude: service.location?.longitude || null,
            phone: service.phones?.[0]?.number || null,
            website: service.url || null,
            email: service.email || null,
            hours: service.hours || null,
            howToApply: service.applicationProcess || null,
            source: '211',
            sourceId: service.id,
            verifiedAt: new Date(),
          },
        })
        added++
      }
    } catch (error) {
      errors.push(`${term}: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return { added, skipped, errors }
}
