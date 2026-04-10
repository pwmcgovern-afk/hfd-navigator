import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface FeedbackRow {
  resourceId: string
  name: string | null
  helpfulCount: number
  notHelpfulCount: number
  totalCount: number
}

export default async function AdminFeedbackPage() {
  const feedback = await prisma.$queryRaw<FeedbackRow[]>`
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

  const totalFeedback = feedback.reduce((sum, f) => sum + f.totalCount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback</h1>
      <p className="text-sm text-gray-500 mb-6">{totalFeedback} total responses across {feedback.length} resources</p>

      {feedback.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center text-gray-400">
          No feedback received yet. Feedback buttons appear on resource detail pages.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Resource</th>
                <th className="text-center px-4 py-3 font-medium text-green-600">Helpful</th>
                <th className="text-center px-4 py-3 font-medium text-red-600">Not Helpful</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedback.map((row) => (
                <tr key={row.resourceId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{row.name || 'Unknown Resource'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      {row.helpfulCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.notHelpfulCount > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {row.notHelpfulCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{row.totalCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/resources/${row.resourceId}/edit`}
                      className="text-teal-700 hover:text-teal-900 text-xs font-medium"
                    >
                      Edit Resource
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
