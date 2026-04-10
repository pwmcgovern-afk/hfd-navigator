import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminSuggestionsPage() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const pending = suggestions.filter(s => s.status === 'pending')
  const reviewed = suggestions.filter(s => s.status !== 'pending')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Suggestions</h1>
      <p className="text-sm text-gray-500 mb-6">{pending.length} pending, {reviewed.length} reviewed</p>

      {suggestions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center text-gray-400">
          No suggestions received yet. Organizations can submit updates via the "Suggest Update" page.
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map(s => (
            <div key={s.id} className={`bg-white rounded-xl p-5 shadow-sm border ${s.status === 'pending' ? 'border-yellow-300' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    s.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {s.status}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {s.type === 'new' ? 'New Resource' : 'Update'} · {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {s.submitterName && (
                <p className="text-sm text-gray-600 mb-2">
                  From: {s.submitterName}
                  {s.submitterOrg && ` (${s.submitterOrg})`}
                  {s.submitterEmail && ` — ${s.submitterEmail}`}
                </p>
              )}

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <pre className="whitespace-pre-wrap text-xs text-gray-700 font-mono">
                  {JSON.stringify(s.changes, null, 2)}
                </pre>
              </div>

              {s.resourceId && (
                <a href={`/admin/resources/${s.resourceId}/edit`} className="text-xs text-teal-700 hover:text-teal-900 mt-2 inline-block">
                  View Resource
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
