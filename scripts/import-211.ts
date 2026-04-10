/**
 * 211 Connecticut API Integration
 *
 * This script fetches resources from the 211 National Data Platform API
 * and imports them into the Hartford Navigator database.
 *
 * API Documentation: https://apiportal.211.org/
 * Registration: https://register.211.org/
 *
 * To use this script:
 * 1. Sign up for API access at https://register.211.org/
 * 2. Get your API subscription key from the developer portal
 * 3. Set the API_211_KEY environment variable
 * 4. Run: npx tsx scripts/import-211.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const API_BASE = 'https://api.211.org/search/v1'
const API_KEY = process.env.API_211_KEY

// Category mapping from 211 taxonomy to our categories
const CATEGORY_MAP: Record<string, string[]> = {
  // Housing
  'BH': ['housing'], // Housing
  'BH-1800': ['housing'], // Emergency Shelter
  'BH-3000': ['housing'], // Low Cost Housing
  'BH-8600': ['housing'], // Transitional Housing

  // Food
  'BD': ['food'], // Food
  'BD-1800': ['food'], // Emergency Food
  'BD-5000': ['food'], // Food Pantries
  'BD-5000.6500': ['food'], // Soup Kitchens

  // Healthcare
  'LF': ['healthcare'], // Health Care
  'LF-1000': ['healthcare'], // Clinics
  'LF-4500': ['healthcare'], // Mental Health (also maps to mental-health)

  // Mental Health
  'RF': ['mental-health'], // Counseling/Support Groups

  // Substance Abuse
  'RX': ['harm-reduction'], // Substance Use Disorder Services

  // Employment
  'ND': ['employment'], // Employment
  'ND-2000': ['employment'], // Job Training

  // Legal
  'FT': ['legal'], // Legal Services

  // Utilities
  'BV': ['utilities'], // Utility Assistance

  // Transportation
  'BT': ['transportation'], // Transportation

  // Childcare
  'PH': ['childcare'], // Child Care

  // Immigration
  'FT-3200': ['immigration'], // Immigration Legal Services
}

interface Service211 {
  id: string
  name: string
  description: string
  organization?: {
    name: string
  }
  location?: {
    address1?: string
    city?: string
    state?: string
    postalCode?: string
    latitude?: number
    longitude?: number
  }
  phones?: Array<{
    number: string
    type?: string
  }>
  url?: string
  email?: string
  hours?: string
  taxonomies?: Array<{
    code: string
    name: string
  }>
  eligibility?: string
  applicationProcess?: string
}

function mapCategories(taxonomies: Array<{ code: string; name: string }> | undefined): string[] {
  if (!taxonomies) return ['healthcare'] // Default category

  const categories = new Set<string>()

  for (const tax of taxonomies) {
    // Check for exact match first
    if (CATEGORY_MAP[tax.code]) {
      CATEGORY_MAP[tax.code].forEach(cat => categories.add(cat))
    } else {
      // Check for parent category match (first 2 characters)
      const parentCode = tax.code.substring(0, 2)
      if (CATEGORY_MAP[parentCode]) {
        CATEGORY_MAP[parentCode].forEach(cat => categories.add(cat))
      }
    }
  }

  // Default to healthcare if no matches
  if (categories.size === 0) {
    categories.add('healthcare')
  }

  return Array.from(categories)
}

async function searchServices(query: string, location: string = 'Hartford, CT', distance: number = 10): Promise<Service211[]> {
  if (!API_KEY) {
    throw new Error('API_211_KEY environment variable not set. Get your key at https://register.211.org/')
  }

  const params = new URLSearchParams({
    searchTerms: query,
    location: location,
    distance: distance.toString(),
    top: '100'
  })

  const response = await fetch(`${API_BASE}/search?${params}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': API_KEY,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`211 API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.results || []
}

async function importService(service: Service211): Promise<boolean> {
  // Check if already exists
  const existing = await prisma.resource.findFirst({
    where: {
      OR: [
        { name: service.name },
        { sourceId: service.id, source: '211' }
      ]
    }
  })

  if (existing) {
    console.log(`  Skipped (exists): ${service.name}`)
    return false
  }

  const categories = mapCategories(service.taxonomies)
  const phone = service.phones?.[0]?.number

  await prisma.resource.create({
    data: {
      name: service.name,
      organization: service.organization?.name || null,
      description: service.description || 'Contact for more information.',
      categories,
      address: service.location?.address1 || null,
      city: service.location?.city || 'Hartford',
      state: service.location?.state || 'CT',
      zip: service.location?.postalCode || null,
      latitude: service.location?.latitude || null,
      longitude: service.location?.longitude || null,
      phone: phone || null,
      website: service.url || null,
      email: service.email || null,
      hours: service.hours || null,
      howToApply: service.applicationProcess || null,
      source: '211',
      sourceId: service.id,
      verifiedAt: new Date()
    }
  })

  console.log(`  Added: ${service.name}`)
  return true
}

async function importFromSearch(query: string): Promise<number> {
  console.log(`\nSearching 211 for: "${query}"`)

  try {
    const services = await searchServices(query)
    console.log(`  Found ${services.length} services`)

    let added = 0
    for (const service of services) {
      if (await importService(service)) {
        added++
      }
    }

    return added
  } catch (error) {
    console.error(`  Error searching for "${query}":`, error)
    return 0
  }
}

async function main() {
  console.log('=== 211 Connecticut Import ===\n')

  if (!API_KEY) {
    console.log(`
ERROR: No API key found!

To use this script, you need a 211 API key:

1. Go to https://register.211.org/
2. Click "Sign Up" to create a developer account
3. Subscribe to the API (Trial product is free)
4. Copy your subscription key from the developer portal
5. Run this script with:

   API_211_KEY=your-key-here npx tsx scripts/import-211.ts

Or add to your .env file:

   API_211_KEY=your-key-here
`)
    process.exit(1)
  }

  // Search terms to import
  const searchTerms = [
    'food pantry',
    'soup kitchen',
    'emergency shelter',
    'homeless services',
    'housing assistance',
    'rent assistance',
    'utility assistance',
    'mental health',
    'substance abuse treatment',
    'addiction recovery',
    'job training',
    'employment services',
    'legal aid',
    'immigration services',
    'domestic violence',
    'childcare',
    'health clinic',
    'free clinic',
    'medication assistance',
    'transportation assistance'
  ]

  let totalAdded = 0

  for (const term of searchTerms) {
    const added = await importFromSearch(term)
    totalAdded += added

    // Rate limiting - be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`\n=== Import Complete ===`)
  console.log(`Total new resources added: ${totalAdded}`)
}

main()
  .catch((e) => {
    console.error('Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
