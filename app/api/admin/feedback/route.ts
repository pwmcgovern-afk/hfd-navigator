import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    // Aggregate feedback per resource
    const feedback = await prisma.$queryRaw`
      SELECT
        f."resourceId",
        r."name",
        COUNT(*) FILTER (WHERE f."helpful" = true)::int as "helpfulCount",
        COUNT(*) FILTER (WHERE f."helpful" = false)::int as "notHelpfulCount",
        COUNT(*)::int as "totalCount"
      FROM "Feedback" f
      LEFT JOIN "Resource" r ON r."id" = f."resourceId"
      GROUP BY f."resourceId", r."name"
      ORDER BY COUNT(*) FILTER (WHERE f."helpful" = false) DESC
    `

    return Response.json({ feedback })
  } catch (error) {
    console.error('Feedback stats error:', error)
    return Response.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
