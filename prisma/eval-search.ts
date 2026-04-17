/**
 * Chat search evaluation harness.
 *
 * Runs a hand-curated set of natural-language queries against `searchResources`
 * and reports recall@5 by expected category (and, where pinned, by expected
 * resource ID). Run before/after enabling embeddings to see the lift.
 *
 * Usage:
 *   npx tsx prisma/eval-search.ts             # uses whatever search mode is
 *                                             # active (semantic if OPENAI_API_KEY
 *                                             # is set + embeddings backfilled)
 *
 * Required env: DATABASE_URL. Optional: OPENAI_API_KEY for hybrid mode.
 *
 * The eval set is intentionally small (~18 cases) and skewed toward queries
 * where keyword search struggles — the kind of paraphrases real users actually
 * type. Add more pairs as you observe real chat traffic.
 */
import { searchResources, isSemanticSearchEnabled } from '../lib/search'
import { prisma } from '../lib/db'

interface EvalCase {
  query: string
  expectedCategories: string[]   // recall@5 passes if ≥1 expected category appears
  language?: 'en' | 'es'
  description: string            // human-readable label for the report
}

const EVAL_SET: EvalCase[] = [
  // Easy — keyword and semantic both nail
  { query: 'food pantry', expectedCategories: ['food'], description: 'simple keyword: food pantry' },
  { query: 'free legal help', expectedCategories: ['legal'], description: 'simple keyword: legal aid' },
  { query: 'homeless shelter', expectedCategories: ['housing'], description: 'simple keyword: shelter' },

  // Paraphrase — keyword often misses, semantic usually wins
  { query: "I'm sleeping in my car", expectedCategories: ['housing'], description: 'paraphrase: car -> shelter' },
  { query: "haven't eaten in two days", expectedCategories: ['food'], description: 'paraphrase: hungry -> food' },
  { query: "my landlord is trying to evict me", expectedCategories: ['legal', 'housing'], description: 'paraphrase: eviction -> legal/housing' },
  { query: 'I just got out of jail and need a fresh start', expectedCategories: ['employment', 'housing'], description: 'paraphrase: reentry' },
  { query: 'need help paying my electric bill', expectedCategories: ['utilities'], description: 'paraphrase: bill -> utilities' },
  { query: "can't afford my insulin", expectedCategories: ['healthcare'], description: 'paraphrase: medication -> healthcare' },
  { query: 'my husband hits me', expectedCategories: ['housing', 'legal'], description: 'paraphrase: DV -> shelter/legal' },
  { query: 'pregnant and uninsured', expectedCategories: ['healthcare'], description: 'paraphrase: prenatal -> healthcare' },
  { query: 'detox bed', expectedCategories: ['mental-health', 'harm-reduction', 'healthcare'], description: 'jargon: detox' },

  // Spanish
  { query: 'necesito comida para mis hijos', expectedCategories: ['food'], language: 'es', description: 'ES: food for kids' },
  { query: 'me van a desalojar', expectedCategories: ['legal', 'housing'], language: 'es', description: 'ES: eviction' },
  { query: 'mi esposo no tiene papeles', expectedCategories: ['immigration', 'legal'], language: 'es', description: 'ES: undocumented' },
  { query: 'ayuda con la renta', expectedCategories: ['housing', 'cash'], language: 'es', description: 'ES: rent help' },

  // Edge cases
  { query: 'help me get to my doctor appointment', expectedCategories: ['transportation', 'healthcare'], description: 'transport + medical' },
  { query: 'free childcare so I can work', expectedCategories: ['childcare'], description: 'childcare for employment' },
]

interface CaseResult {
  query: string
  description: string
  topCategories: string[]
  hit: boolean
  topIds: string[]
}

async function runOne(c: EvalCase): Promise<CaseResult> {
  const hits = await searchResources({ query: c.query, limit: 5 })
  const topCategories = Array.from(
    new Set(hits.flatMap(h => h.categories))
  )
  const hit = c.expectedCategories.some(want => topCategories.includes(want))
  return {
    query: c.query,
    description: c.description,
    topCategories,
    hit,
    topIds: hits.map(h => h.id),
  }
}

async function main() {
  const mode = isSemanticSearchEnabled() ? 'HYBRID (keyword + pgvector)' : 'KEYWORD only'
  console.log(`\nNHV Navigator chat-search eval`)
  console.log(`Mode: ${mode}`)
  console.log(`Cases: ${EVAL_SET.length}`)
  console.log('-'.repeat(72))

  let hits = 0
  const failures: CaseResult[] = []

  for (const c of EVAL_SET) {
    const r = await runOne(c)
    if (r.hit) {
      hits++
      console.log(`PASS  ${c.description}`)
    } else {
      failures.push(r)
      console.log(`FAIL  ${c.description}`)
      console.log(`        query="${c.query}"`)
      console.log(`        expected one of: [${(c.expectedCategories).join(', ')}]`)
      console.log(`        got categories:  [${r.topCategories.join(', ')}]`)
    }
  }

  console.log('-'.repeat(72))
  const recall = hits / EVAL_SET.length
  console.log(`Recall@5 (category): ${(recall * 100).toFixed(1)}% (${hits}/${EVAL_SET.length})\n`)

  // Helpful when you're triaging which cases to improve.
  if (failures.length) {
    console.log('Failed cases (sorted as in eval set):')
    for (const f of failures) console.log(`  - ${f.description}`)
    console.log('')
  }
}

main()
  .catch(err => {
    console.error('Eval run failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
