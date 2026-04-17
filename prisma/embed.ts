/**
 * CLI wrapper around lib/embed-resources.ts for backfill / refresh.
 *
 * Usage:
 *   npx tsx prisma/embed.ts                    # embed every resource
 *   npx tsx prisma/embed.ts --only-missing     # only rows where embedding IS NULL
 *   npx tsx prisma/embed.ts --since-hours 24   # only rows updated in last 24h
 *
 * Required env: OPENAI_API_KEY, DATABASE_URL.
 *
 * The actual embedding work lives in `lib/embed-resources.ts` so the
 * Vercel cron at /api/cron/refresh-embeddings runs the exact same code.
 */
import { embedResources, type EmbedTargetSelector } from '../lib/embed-resources'
import { prisma } from '../lib/db'

function parseArgs(argv: string[]): EmbedTargetSelector {
  const opts: EmbedTargetSelector = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--only-missing') opts.onlyMissing = true
    else if (a === '--since-hours') {
      const v = argv[++i]
      if (!v || isNaN(Number(v))) throw new Error('--since-hours requires a number')
      opts.sinceHours = Number(v)
    }
  }
  return opts
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY env var is required.')
    process.exit(1)
  }

  const opts = parseArgs(process.argv.slice(2))
  const mode = opts.onlyMissing ? 'only-missing' : opts.sinceHours ? `since-hours=${opts.sinceHours}` : 'all'
  console.log(`Embedding resources (mode: ${mode})…`)

  const result = await embedResources(opts)

  if (result.processed === 0) {
    console.log('Nothing to embed.')
    return
  }
  console.log(`Done. ${result.processed} resources embedded across ${result.batches} batches in ${result.ms}ms.`)
}

main()
  .catch(err => {
    console.error('Embedding backfill failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
