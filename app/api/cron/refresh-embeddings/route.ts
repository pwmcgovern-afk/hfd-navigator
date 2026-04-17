/**
 * Daily cron: re-embed any resource updated in the last 25 hours.
 *
 * Wired in vercel.json (`/api/cron/refresh-embeddings`, 0 8 * * *).
 * Auth: requires Authorization: Bearer ${CRON_SECRET}, same pattern as
 * the existing /api/admin/translate cron.
 *
 * The 25-hour window has 1h overlap with the daily schedule so we don't
 * miss rows updated near midnight if a run is delayed.
 */
import * as Sentry from '@sentry/nextjs'
import { embedResources } from '@/lib/embed-resources'
import { invalidateResourceCache } from '@/lib/search'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function isCronRequest(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)
}

export async function GET(req: Request) {
  if (!isCronRequest(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await embedResources({ sinceHours: 25, maxRows: 500 })
    invalidateResourceCache()
    console.log(JSON.stringify({ event: 'cron_refresh_embeddings', ...result }))
    return Response.json({ ok: true, ...result })
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'cron/refresh-embeddings' } })
    console.error('refresh-embeddings cron failed:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
