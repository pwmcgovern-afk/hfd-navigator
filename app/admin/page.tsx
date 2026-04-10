import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
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
    recentFeedback,
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
    prisma.feedback.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    }),
  ])

  const recentChanges = await prisma.changeLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const unhelpfulFeedback = totalFeedback - helpfulFeedback

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Resources" value={totalResources} />
        <StatCard label="Manual" value={manualResources} />
        <StatCard label="From 211" value={importedResources} />
        <StatCard label="Feedback (7d)" value={recentFeedback} />
      </div>

      {/* Alerts */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AlertCard
          label="Stale Resources"
          value={staleResources}
          description="Not verified in 6+ months"
          href="/admin/resources?stale=1"
          color={staleResources > 0 ? 'red' : 'green'}
        />
        <AlertCard
          label="Untranslated"
          value={untranslatedResources}
          description="Missing Spanish translation"
          href="/admin/resources?untranslated=1"
          color={untranslatedResources > 0 ? 'yellow' : 'green'}
        />
        <AlertCard
          label="Negative Feedback"
          value={unhelpfulFeedback}
          description={`${helpfulFeedback} helpful / ${unhelpfulFeedback} not helpful`}
          href="/admin/feedback"
          color={unhelpfulFeedback > 5 ? 'yellow' : 'green'}
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <a href="/admin/resources/new" className="px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors">
          Add Resource
        </a>
        <a href="/admin/imports" className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
          Run Imports
        </a>
        <a href="/admin/resources?stale=1" className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
          Review Stale
        </a>
      </div>

      {/* Recent Activity */}
      {recentChanges.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {recentChanges.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        log.action === 'created' ? 'bg-green-100 text-green-700' :
                        log.action === 'deleted' ? 'bg-red-100 text-red-700' :
                        log.action === 'verified' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{log.resourceName}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function AlertCard({ label, value, description, href, color }: {
  label: string; value: number; description: string; href: string;
  color: 'red' | 'yellow' | 'green'
}) {
  const colorStyles = {
    red: 'border-red-200 bg-red-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    green: 'border-green-200 bg-green-50',
  }
  const textColor = {
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    green: 'text-green-700',
  }

  return (
    <a href={href} className={`block rounded-xl p-5 border ${colorStyles[color]} hover:shadow-md transition-shadow`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${textColor[color]}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </a>
  )
}
