/**
 * Reusable resource-embedding logic shared by:
 *   - prisma/embed.ts (one-shot CLI for backfill / manual refresh)
 *   - app/api/cron/refresh-embeddings/route.ts (Vercel cron)
 *
 * Returns a summary so the cron can log how much work it actually did.
 */
import { prisma } from '@/lib/db'

const EMBEDDING_MODEL = 'text-embedding-3-small'
const BATCH_SIZE = 50

interface ResourceForEmbedding {
  id: string
  name: string
  organization: string | null
  description: string
  descriptionEs: string | null
  categories: string[]
}

interface RowWithEmbedding {
  id: string
}

export interface EmbedResult {
  processed: number
  batches: number
  ms: number
  skippedNoApiKey?: boolean
}

function buildEmbeddingText(r: ResourceForEmbedding): string {
  const parts = [
    r.name,
    r.organization,
    r.categories.join(', '),
    r.description,
    r.descriptionEs,
  ].filter((s): s is string => Boolean(s && s.trim()))
  return parts.join('\n')
}

export interface EmbedTargetSelector {
  /** Embed only rows missing an embedding (good for incremental). */
  onlyMissing?: boolean
  /** Embed rows updated within the last N hours (good for daily cron). */
  sinceHours?: number
  /** Cap the number of rows touched in a single run (cron safety). */
  maxRows?: number
}

async function selectTargetIds(opts: EmbedTargetSelector): Promise<string[]> {
  if (opts.onlyMissing) {
    const rows = await prisma.$queryRaw<RowWithEmbedding[]>`
      SELECT id FROM "Resource" WHERE embedding IS NULL
    `
    return rows.map(r => r.id)
  }
  if (opts.sinceHours !== undefined && opts.sinceHours !== null) {
    const since = new Date(Date.now() - opts.sinceHours * 60 * 60 * 1000)
    const rows = await prisma.resource.findMany({
      where: { updatedAt: { gte: since } },
      select: { id: true },
    })
    return rows.map(r => r.id)
  }
  const rows = await prisma.resource.findMany({ select: { id: true } })
  return rows.map(r => r.id)
}

export async function embedResources(opts: EmbedTargetSelector = {}): Promise<EmbedResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { processed: 0, batches: 0, ms: 0, skippedNoApiKey: true }
  }

  const startedAt = Date.now()
  const ids = (await selectTargetIds(opts)).slice(0, opts.maxRows ?? Number.MAX_SAFE_INTEGER)

  if (ids.length === 0) {
    return { processed: 0, batches: 0, ms: Date.now() - startedAt }
  }

  const resources = await prisma.resource.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      organization: true,
      description: true,
      descriptionEs: true,
      categories: true,
    },
  })

  // Lazy-import the AI SDK so the route bundle stays small when the cron
  // is configured but no embedding work is needed.
  const { embedMany } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')

  let processed = 0
  let batches = 0

  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE)
    const { embeddings } = await embedMany({
      model: openai.embedding(EMBEDDING_MODEL),
      values: batch.map(buildEmbeddingText),
    })

    await prisma.$transaction(
      batch.map((r, idx) => {
        const vec = `[${embeddings[idx].join(',')}]`
        return prisma.$executeRaw`
          UPDATE "Resource"
          SET embedding = ${vec}::vector
          WHERE id = ${r.id}
        `
      })
    )

    processed += batch.length
    batches++
  }

  return { processed, batches, ms: Date.now() - startedAt }
}
