import { requireAdmin } from '@/lib/admin-auth'
import { runTranslation } from '@/lib/translate'

function isCronRequest(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)
}

export async function POST(req: Request) {
  if (!isCronRequest(req)) {
    const authError = requireAdmin(req)
    if (authError) return authError
  }

  try {
    const result = await runTranslation()
    return Response.json(result)
  } catch (error) {
    console.error('Translation error:', error)
    return Response.json(
      { error: 'Translation failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
