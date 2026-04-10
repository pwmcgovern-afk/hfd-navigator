import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'
import { CATEGORIES_I18N } from '@/lib/categories'
import Link from 'next/link'

export default async function AdminResourcesPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string; source?: string; stale?: string; untranslated?: string; page?: string; success?: string }
}) {
  const q = searchParams.q || ''
  const category = searchParams.category || ''
  const source = searchParams.source || ''
  const stale = searchParams.stale === '1'
  const untranslated = searchParams.untranslated === '1'
  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const pageSize = 20

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const where: Prisma.ResourceWhereInput = {
    AND: [
      q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { organization: { contains: q, mode: 'insensitive' } },
        ]
      } : {},
      category ? { categories: { has: category } } : {},
      source ? { source } : {},
      stale ? { OR: [{ verifiedAt: null }, { verifiedAt: { lt: sixMonthsAgo } }] } : {},
      untranslated ? { nameEs: null } : {},
    ]
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, name: true, organization: true, categories: true,
        source: true, verifiedAt: true, nameEs: true, phone: true,
      }
    }),
    prisma.resource.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  // Build filter URL helper
  function filterUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    if (q && !overrides.q) params.set('q', q)
    if (category && !overrides.category) params.set('category', category)
    if (source && !overrides.source) params.set('source', source)
    if (stale && !overrides.stale) params.set('stale', '1')
    if (untranslated && !overrides.untranslated) params.set('untranslated', '1')
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v)
    }
    return `/admin/resources?${params.toString()}`
  }

  function freshnessColor(verifiedAt: Date | null) {
    if (!verifiedAt) return 'bg-red-100 text-red-700'
    const months = (Date.now() - new Date(verifiedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (months < 3) return 'bg-green-100 text-green-700'
    if (months < 6) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources ({total})</h1>
        <Link
          href="/admin/resources/new"
          className="px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors"
        >
          + Add Resource
        </Link>
      </div>

      {/* Success message */}
      {searchParams.success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          Resource {searchParams.success} successfully.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <form action="/admin/resources" method="GET" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              type="text" name="q" defaultValue={q}
              placeholder="Search by name or org..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select name="category" defaultValue={category} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All</option>
              {CATEGORIES_I18N.map(c => (
                <option key={c.slug} value={c.slug}>{c.icon} {c.en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
            <select name="source" defaultValue={source} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All</option>
              <option value="manual">Manual</option>
              <option value="211">211</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="stale" value="1" defaultChecked={stale} className="rounded" />
            Stale only
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="untranslated" value="1" defaultChecked={untranslated} className="rounded" />
            Untranslated
          </label>
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900">
            Filter
          </button>
          <a href="/admin/resources" className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Clear</a>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Categories</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Verified</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ES</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{resource.name}</div>
                  {resource.organization && resource.organization !== resource.name && (
                    <div className="text-xs text-gray-500">{resource.organization}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {resource.categories.slice(0, 3).map(cat => {
                      const info = CATEGORIES_I18N.find(c => c.slug === cat)
                      return (
                        <span key={cat} className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {info?.icon} {info?.en || cat}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{resource.source}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${freshnessColor(resource.verifiedAt)}`}>
                    {resource.verifiedAt ? new Date(resource.verifiedAt).toLocaleDateString() : 'Never'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {resource.nameEs ? (
                    <span className="text-green-600 text-xs">Yes</span>
                  ) : (
                    <span className="text-red-500 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/resources/${resource.id}/edit`}
                    className="text-teal-700 hover:text-teal-900 text-xs font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No resources found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={filterUrl({ page: String(page - 1) })} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </a>
            )}
            {page < totalPages && (
              <a href={filterUrl({ page: String(page + 1) })} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
