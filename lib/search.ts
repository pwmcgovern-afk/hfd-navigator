import { prisma } from '@/lib/db'
import { SERVED_CITIES } from '@/lib/constants'

// A single resource shape used by both the chat tools and any other
// in-process keyword search. Keep this lean — the full record lives in the
// DB and is fetched on demand via getResourceDetails().
export interface SearchableResource {
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
  searchText: string
}

let cache: SearchableResource[] | null = null
let cacheExpiry = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// In-memory cache so chat tool calls don't hammer the DB. Resets on cold
// start, which is fine — the data refreshes hourly in steady state and
// admin edits invalidate via `invalidateResourceCache()` below.
export async function loadResources(): Promise<SearchableResource[]> {
  const now = Date.now()
  if (cache && now < cacheExpiry) return cache

  const rows = await prisma.resource.findMany({
    where: { city: { in: [...SERVED_CITIES] } },
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

  cache = rows.map(r => ({
    ...r,
    searchText: [
      r.name,
      r.nameEs,
      r.organization,
      r.description,
      r.descriptionEs,
      ...r.categories,
    ].filter(Boolean).join(' ').toLowerCase(),
  }))
  cacheExpiry = now + CACHE_TTL_MS
  return cache
}

export function invalidateResourceCache() {
  cache = null
  cacheExpiry = 0
}

// Test-only escape hatch so __tests__/search.test.ts can run without Prisma.
// Production code should never call this — the leading underscore signals
// "internal" and the `if (process.env.NODE_ENV === 'production')` guard
// keeps it inert in deployed builds.
export function _testInjectCache(rows: SearchableResource[]) {
  if (process.env.NODE_ENV === 'production') return
  cache = rows
  cacheExpiry = Date.now() + CACHE_TTL_MS
}

export interface SearchOptions {
  query?: string
  category?: string
  limit?: number
}

export interface SearchHit {
  id: string
  name: string
  nameEs: string | null
  organization: string | null
  categories: string[]
  phone: string | null
  // Combined ranking score. With keyword-only this is the raw match count;
  // with hybrid it's a Reciprocal Rank Fusion (RRF) score in roughly [0, 0.05].
  score: number
  // First sentence of the description so the model has just enough to triage
  // without paying for the full record. Use get_resource_details for more.
  snippet: string
}

// ============================================================================
// KEYWORD SEARCH (Tier 1 — always available)
// ============================================================================

interface KeywordRanking {
  resource: SearchableResource
  score: number
}

function keywordRank(opts: SearchOptions, all: SearchableResource[]): KeywordRanking[] {
  const { query, category } = opts

  let pool = all
  if (category) {
    const cat = category.toLowerCase()
    pool = pool.filter(r => r.categories.some(c => c.toLowerCase() === cat))
  }

  if (!query || !query.trim()) {
    return pool.map(r => ({ resource: r, score: 0 }))
  }

  const words = query
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)

  if (words.length === 0) {
    return pool.map(r => ({ resource: r, score: 0 }))
  }

  return pool
    .map(r => {
      let score = 0
      for (const w of words) {
        if (r.searchText.includes(w)) {
          score += 1
          if (r.name.toLowerCase().includes(w)) score += 2
          if (r.categories.some(c => c.toLowerCase().includes(w))) score += 2
        }
      }
      return { resource: r, score }
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
}

// ============================================================================
// SEMANTIC SEARCH (Tier 2 — opt-in via OPENAI_API_KEY env + populated embeddings)
// ============================================================================

const EMBEDDING_MODEL = 'text-embedding-3-small'

export function isSemanticSearchEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY
}

// Lazy-import to avoid loading @ai-sdk/openai when the feature is disabled.
async function embedQuery(query: string): Promise<number[]> {
  const { embed } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: query,
  })
  return embedding
}

interface VectorHit {
  id: string
  similarity: number
}

async function vectorSearch(
  queryEmbedding: number[],
  category: string | undefined,
  limit: number
): Promise<VectorHit[]> {
  const vectorLiteral = `[${queryEmbedding.join(',')}]`
  // pgvector cosine distance: `<=>` returns a value in [0, 2]; similarity = 1 - distance.
  // We filter to rows with embeddings, served cities (so HFD doesn't surface
  // Bridgeport entries from the shared DB), AND optionally a category.
  const cities = [...SERVED_CITIES]
  if (category) {
    return prisma.$queryRaw<VectorHit[]>`
      SELECT id, (1 - (embedding <=> ${vectorLiteral}::vector))::float AS similarity
      FROM "Resource"
      WHERE embedding IS NOT NULL
        AND city = ANY(${cities})
        AND ${category} = ANY(categories)
      ORDER BY embedding <=> ${vectorLiteral}::vector
      LIMIT ${limit}
    `
  }
  return prisma.$queryRaw<VectorHit[]>`
    SELECT id, (1 - (embedding <=> ${vectorLiteral}::vector))::float AS similarity
    FROM "Resource"
    WHERE embedding IS NOT NULL
      AND city = ANY(${cities})
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${limit}
  `
}

// ============================================================================
// HYBRID FUSION
// ============================================================================

// Reciprocal Rank Fusion — robust to score-scale differences between
// keyword (integer match counts) and vector (cosine similarity).
//   RRF(d) = Σ 1 / (k + rank_i(d))
// k=60 is the value from the original RRF paper; behaves well in practice.
const RRF_K = 60

function fuseResults(
  keywordRanked: KeywordRanking[],
  vectorRanked: VectorHit[],
  resourceById: Map<string, SearchableResource>,
  limit: number
): SearchHit[] {
  const rrfScores = new Map<string, number>()

  keywordRanked.forEach((kr, i) => {
    const rank = i + 1
    rrfScores.set(kr.resource.id, (rrfScores.get(kr.resource.id) ?? 0) + 1 / (RRF_K + rank))
  })

  vectorRanked.forEach((vr, i) => {
    const rank = i + 1
    rrfScores.set(vr.id, (rrfScores.get(vr.id) ?? 0) + 1 / (RRF_K + rank))
  })

  const ranked = Array.from(rrfScores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  const hits: SearchHit[] = []
  for (const { id, score } of ranked) {
    const r = resourceById.get(id)
    if (r) hits.push(toHit(r, score))
  }
  return hits
}

// ============================================================================
// PUBLIC API
// ============================================================================

// Phase 2 will extend this with a vector similarity blend; the function
// signature should stay stable so the chat tool keeps working.
export async function searchResources(opts: SearchOptions): Promise<SearchHit[]> {
  const { query, limit = 10 } = opts
  const all = await loadResources()
  const keywordRanked = keywordRank(opts, all)

  // Three exit paths:
  //   1. No query → return keyword pool (which is just category-filtered)
  //   2. Semantic disabled → return keyword-only ranking
  //   3. Semantic enabled but errors → fall back to keyword
  if (!query || !query.trim() || !isSemanticSearchEnabled()) {
    return keywordRanked.slice(0, limit).map(({ resource, score }) => toHit(resource, score))
  }

  try {
    const queryEmbedding = await embedQuery(query)
    // Pull a deeper vector pool than `limit` so RRF has more candidates to
    // mix with the keyword side.
    const vectorRanked = await vectorSearch(queryEmbedding, opts.category, limit * 3)

    if (vectorRanked.length === 0) {
      return keywordRanked.slice(0, limit).map(({ resource, score }) => toHit(resource, score))
    }

    const byId = new Map(all.map(r => [r.id, r]))
    return fuseResults(keywordRanked, vectorRanked, byId, limit)
  } catch (err) {
    console.error('Hybrid search failed, falling back to keyword:', err)
    return keywordRanked.slice(0, limit).map(({ resource, score }) => toHit(resource, score))
  }
}

function toHit(r: SearchableResource, score: number): SearchHit {
  const firstSentence = r.description.split(/(?<=[.!?])\s/)[0] || r.description
  return {
    id: r.id,
    name: r.name,
    nameEs: r.nameEs,
    organization: r.organization,
    categories: r.categories,
    phone: r.phone,
    score,
    snippet: firstSentence.slice(0, 200),
  }
}

export interface ResourceDetail {
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
}

export async function getResourceDetails(id: string): Promise<ResourceDetail | null> {
  const all = await loadResources()
  const hit = all.find(r => r.id === id)
  if (!hit) return null
  // Drop the searchText helper field — it's an implementation detail.
  const { searchText: _searchText, ...rest } = hit
  return rest
}
