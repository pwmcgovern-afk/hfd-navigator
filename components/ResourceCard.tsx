import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'

interface ResourceCardProps {
  id: string
  name: string
  organization?: string | null
  description: string
  categories: string[]
  phone?: string | null
  address?: string | null
  score?: number
}

export default function ResourceCard({
  id,
  name,
  organization,
  description,
  categories,
  phone,
  address,
  score
}: ResourceCardProps) {
  const getCategoryIcon = (slug: string) => {
    return CATEGORIES.find(c => c.slug === slug)?.icon || '📋'
  }

  return (
    <Link href={`/resources/${id}`}>
      <div className="card hover:shadow-md hover:border-primary-200 transition-all">
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {getCategoryIcon(cat)} {CATEGORIES.find(c => c.slug === cat)?.name || cat}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900">{name}</h3>

        {/* Organization */}
        {organization && organization !== name && (
          <p className="text-sm text-gray-500">{organization}</p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        {/* Quick info */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
          {phone && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </span>
          )}
          {address && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {address}
            </span>
          )}
        </div>

        {/* Match score indicator */}
        {score !== undefined && score > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {score >= 80 ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Good match
                </span>
              ) : score >= 50 ? (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  May qualify
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Check eligibility
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
