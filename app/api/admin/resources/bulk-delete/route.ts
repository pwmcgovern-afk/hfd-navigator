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

    // Delete orphaned feedback first
    await prisma.feedback.deleteMany({ where: { resourceId: { in: resourceIds } } })
    const result = await prisma.resource.deleteMany({ where: { id: { in: resourceIds } } })

    return Response.json({ success: true, deleted: result.count })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return Response.json({ error: 'Failed to delete resources' }, { status: 500 })
  }
}
