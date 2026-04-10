import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    // Simple API key auth — set ADMIN_API_KEY in Vercel env vars
    const authHeader = req.headers.get('authorization')
    const apiKey = process.env.ADMIN_API_KEY

    if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { resourceId } = body

    if (!resourceId) {
      return new Response(
        JSON.stringify({ error: 'resourceId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: { verifiedAt: new Date() },
      select: { id: true, name: true, verifiedAt: true },
    })

    return new Response(
      JSON.stringify({ success: true, resource }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Admin verify error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to verify resource' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
