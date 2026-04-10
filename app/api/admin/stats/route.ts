import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [
      totalResources,
      staleResources,
      untranslatedResources,
      manualResources,
      importedResources,
      totalFeedback,
      helpfulFeedback,
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({
        where: { OR: [{ verifiedAt: null }, { verifiedAt: { lt: sixMonthsAgo } }] }
      }),
      prisma.resource.count({ where: { nameEs: null } }),
      prisma.resource.count({ where: { source: 'manual' } }),
      prisma.resource.count({ where: { source: '211' } }),
      prisma.feedback.count(),
      prisma.feedback.count({ where: { helpful: true } }),
    ])

    return Response.json({
      totalResources,
      staleResources,
      untranslatedResources,
      manualResources,
      importedResources,
      totalFeedback,
      helpfulFeedback,
      unhelpfulFeedback: totalFeedback - helpfulFeedback,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
