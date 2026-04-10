import { prisma } from '@/lib/db'

async function sendNegativeFeedbackAlert(resourceId: string) {
  const resendKey = process.env.RESEND_API_KEY
  const alertEmail = process.env.ADMIN_EMAIL || 'pwmcgovern@gmail.com'
  if (!resendKey) return // Email alerts not configured — skip silently

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

    // Send email alert on negative feedback (non-blocking)
    if (!helpful) {
      sendNegativeFeedbackAlert(resourceId)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Feedback API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save feedback' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
