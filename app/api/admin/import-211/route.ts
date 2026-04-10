import { requireAdmin } from '@/lib/admin-auth'
import { runImport } from '@/lib/import-211'

function isCronRequest(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)
}

export async function POST(req: Request) {
  // Allow both admin auth and Vercel cron secret
  if (!isCronRequest(req)) {
    const authError = requireAdmin(req)
    if (authError) return authError
  }

  const apiKey = process.env.API_211_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'API_211_KEY not configured. Set it in Vercel environment variables.' },
      { status: 500 }
    )
  }

  try {
    const result = await runImport(apiKey)
    return Response.json(result)
  } catch (error) {
    console.error('211 import error:', error)
    return Response.json(
      { error: 'Import failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
