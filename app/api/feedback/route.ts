import { prisma } from '@/lib/db'
import * as Sentry from '@sentry/nextjs'

// Per-IP rate limiter mirroring the chat route. Resets on cold start, so it
// won't stop a determined attacker but will quiet casual abuse.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
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

async function sendNegativeFeedbackAlert(resourceId: string) {
  const resendKey = process.env.RESEND_API_KEY
  const alertEmail = process.env.ADMIN_EMAIL
  // Skip silently if either is missing — never fall back to a hardcoded address.
  if (!resendKey || !alertEmail) return

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { name: true, id: true }
    })

    const count = await prisma.feedback.count({
      where: { resourceId, helpful: false }
    })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HFD Navigator <alerts@hfdnavigator.com>',
        to: alertEmail,
        subject: `Negative feedback: ${resource?.name || resourceId}`,
        text: `A user marked "${resource?.name}" as not helpful.\n\nTotal negative feedback for this resource: ${count + 1}\n\nReview: https://www.hfdnavigator.com/admin/resources/${resourceId}/edit`,
      }),
    })
  } catch {
    // Email send failed — non-critical, don't block the feedback response
  }
}

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
    const { resourceId, helpful } = body

    if (!resourceId || typeof helpful !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: resourceId and helpful required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await prisma.feedback.create({
      data: { resourceId, helpful }
    })

    // Send email alert on negative feedback (non-blocking; explicit catch so
    // a Resend outage can't surface as an unhandled promise rejection)
    if (!helpful) {
      sendNegativeFeedbackAlert(resourceId).catch(err => {
        Sentry.captureException(err, { tags: { route: 'api/feedback', op: 'alert' } })
        console.error('Negative feedback alert failed:', err)
      })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { route: 'api/feedback' } })
    console.error('Feedback API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save feedback' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
