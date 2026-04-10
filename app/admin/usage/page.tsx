import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface ViewCount {
  path: string
  count: bigint | number
}

interface ResourceViewCount {
  resourceId: string
  name: string | null
  count: bigint | number
}

interface CategoryViewCount {
  category: string
  count: bigint | number
}

export default async function AdminUsagePage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalViews7d,
    totalViews30d,
    topPages,
    topResources,
    topCategories,
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.$queryRaw<ViewCount[]>`
      SELECT path, COUNT(*)::int as count
      FROM "PageView"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY path
      ORDER BY count DESC
      LIMIT 15
    `,
    prisma.$queryRaw<ResourceViewCount[]>`
      SELECT pv."resourceId", r."name", COUNT(*)::int as count
      FROM "PageView" pv
      LEFT JOIN "Resource" r ON r."id" = pv."resourceId"
      WHERE pv."resourceId" IS NOT NULL AND pv."createdAt" >= ${thirtyDaysAgo}
      GROUP BY pv."resourceId", r."name"
      ORDER BY count DESC
      LIMIT 15
    `,
    prisma.$queryRaw<CategoryViewCount[]>`
      SELECT category, COUNT(*)::int as count
      FROM "PageView"
      WHERE category IS NOT NULL AND "createdAt" >= ${thirtyDaysAgo}
      GROUP BY category
      ORDER BY count DESC
    `,
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Usage</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Page Views (7 days)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalViews7d}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Page Views (30 days)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalViews30d}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Top Pages (7 days)</h2>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {topPages.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">{row.path}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">{Number(row.count)}</td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top Resources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Most Viewed Resources (30 days)</h2>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {topResources.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">
                    <a href={`/admin/resources/${row.resourceId}/edit`} className="text-teal-700 hover:text-teal-900">
                      {row.name || row.resourceId}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">{Number(row.count)}</td>
                </tr>
              ))}
              {topResources.length === 0 && (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:col-span-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Category Views (30 days)</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {topCategories.map((row, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-medium text-gray-900">{row.category}</span>
                <span className="text-gray-400 ml-2">{Number(row.count)} views</span>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="text-gray-400 text-sm">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
