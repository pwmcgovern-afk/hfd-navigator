import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const { resourceIds } = await req.json()

    if (!Array.isArray(resourceIds) || resourceIds.length === 0) {
      return Response.json({ error: 'resourceIds array required' }, { status: 400 })
    }

    const result = await prisma.resource.updateMany({
      where: { id: { in: resourceIds } },
      data: { verifiedAt: new Date() }
    })

    return Response.json({ success: true, verified: result.count })
  } catch (error) {
    console.error('Bulk verify error:', error)
    return Response.json({ error: 'Failed to verify resources' }, { status: 500 })
  }
}
