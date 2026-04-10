import { prisma } from '@/lib/db'

// Lightweight page view tracker — fire-and-forget from client
export async function POST(req: Request) {
  try {
    const { path, resourceId, category } = await req.json()

    if (!path) {
      return Response.json({ error: 'path required' }, { status: 400 })
    }

    await prisma.pageView.create({
      data: {
        path: path.slice(0, 500),
        resourceId: resourceId || null,
        category: category || null,
      }
    })

    return Response.json({ ok: true })
  } catch {
    // Non-critical — don't fail the user experience
    return Response.json({ ok: true })
  }
}
