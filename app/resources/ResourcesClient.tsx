'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { isOpenNow } from '@/lib/hoursParser'
import { getCategoriesForLanguage, getCategoryInfo } from '@/lib/categories'
import { getDistanceMiles } from '@/lib/geo'

interface Resource {
  id: string
  name: string
  nameEs: string | null
  organization: string | null
  description: string
  descriptionEs: string | null
  categories: string[]
  address: string | null
  phone: string | null
  hours: string | null
  latitude: number | null
  longitude: number | null
}

interface Props {
  resources: Resource[]
  query?: string
  category?: string
  insurance?: string
  langFilter?: string
  accepting?: string
}

const content = {
  en: {
    title: 'All Resources',
    search: 'Search resources...',
    all: 'All',
    resources: 'resources',
    resource: 'resource',
    forQuery: 'for',
    inCategory: 'in',
    noResults: 'No resources found',
    tryDifferent: 'Try a different search term or category',
    openNow: 'Open Now',
    backHome: 'Go back to home page',
    filterBy: 'Filter by category',
    searchLabel: 'Search for resources',
    resultsLabel: 'Search results',
  },
  es: {
    title: 'Todos los Recursos',
    search: 'Buscar recursos...',
    all: 'Todos',
    resources: 'recursos',
    resource: 'recurso',
    forQuery: 'para',
    inCategory: 'en',
    noResults: 'No se encontraron recursos',
    tryDifferent: 'Intente con otro término o categoría',
    openNow: 'Abierto Ahora',
    backHome: 'Volver a la página principal',
    filterBy: 'Filtrar por categoría',
    searchLabel: 'Buscar recursos',
    resultsLabel: 'Resultados de búsqueda',
  }
}

export default function ResourcesClient({ resources, query, category, insurance, langFilter, accepting }: Props) {
  const { language } = useLanguage()
  const t = content[language]
  const cats = getCategoriesForLanguage(language)
  const [openNowFilter, setOpenNowFilter] = useState(false)
  const [nearbySort, setNearbySort] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState(false)

  const getCatName = (slug: string) => getCategoryInfo(slug, language)?.name || slug

  const handleNearbyToggle = useCallback(() => {
    if (nearbySort) {
      setNearbySort(false)
      return
    }
    if (userLocation) {
      setNearbySort(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNearbySort(true)
        setLocationError(false)
      },
      () => setLocationError(true),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [nearbySort, userLocation])

  // Filter and sort
  let filteredResources: (Resource & { distance?: number })[] = openNowFilter
    ? resources.filter(r => isOpenNow(r.hours) !== false)
    : [...resources]

  if (nearbySort && userLocation) {
    filteredResources = filteredResources
      .map(r => ({
        ...r,
        distance: r.latitude && r.longitude
          ? getDistanceMiles(userLocation.lat, userLocation.lng, r.latitude, r.longitude)
          : 999,
      }))
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 px-5 py-4" style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }} role="banner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label={t.backHome}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">{t.title}</h1>
          </div>
          <LanguageToggle />
        </div>

        {/* Search */}
        <form action="/resources" method="GET" role="search" aria-label={t.searchLabel}>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t.search}
              className="input pl-12"
              aria-label={t.searchLabel}
            />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          {insurance && <input type="hidden" name="insurance" value={insurance} />}
          {langFilter && <input type="hidden" name="language" value={langFilter} />}
          {accepting && <input type="hidden" name="accepting" value={accepting} />}
        </form>
      </header>

      <main className="px-5 py-6" role="main" id="main-content">
        {/* Category filter */}
        <nav aria-label={t.filterBy}>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-5 px-5 scrollbar-hide" role="list">
            <Link
              href="/resources"
              className={`category-pill whitespace-nowrap ${!category ? 'active' : ''}`}
              aria-current={!category ? 'page' : undefined}
            >
              {t.all}
            </Link>
            <button
              onClick={() => setOpenNowFilter(!openNowFilter)}
              className={`category-pill whitespace-nowrap ${openNowFilter ? 'active' : ''}`}
              aria-pressed={openNowFilter}
            >
              <span className="mr-1" aria-hidden="true">🕐</span> {t.openNow}
            </button>
            <button
              onClick={handleNearbyToggle}
              className={`category-pill whitespace-nowrap ${nearbySort ? 'active' : ''}`}
              aria-pressed={nearbySort}
            >
              <span className="mr-1" aria-hidden="true">📍</span> {language === 'es' ? 'Cerca' : 'Near Me'}
            </button>
            {accepting === '1' ? (
              <Link href={`/resources?${query ? `q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                className="category-pill whitespace-nowrap active">
                <span className="mr-1" aria-hidden="true">&#9989;</span> {language === 'es' ? 'Abierto' : 'Open'}
              </Link>
            ) : (
              <Link href={`/resources?accepting=1${query ? `&q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                className="category-pill whitespace-nowrap">
                <span className="mr-1" aria-hidden="true">&#9989;</span> {language === 'es' ? 'Abierto' : 'Open'}
              </Link>
            )}
            {insurance && (
              <Link href={`/resources?${query ? `q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                className="category-pill whitespace-nowrap active">
                {insurance} &#10005;
              </Link>
            )}
            {langFilter && (
              <Link href={`/resources?${query ? `q=${query}` : ''}${category ? `&category=${category}` : ''}`}
                className="category-pill whitespace-nowrap active">
                {langFilter} &#10005;
              </Link>
            )}
            {cats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/resources?category=${cat.slug}${query ? `&q=${query}` : ''}`}
                className={`category-pill whitespace-nowrap ${category === cat.slug ? 'active' : ''}`}
                aria-current={category === cat.slug ? 'page' : undefined}
              >
                <span aria-hidden="true">{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </nav>

        {locationError && (
          <p className="text-xs mb-2" style={{ color: 'var(--color-error)' }}>
            {language === 'es' ? 'No se pudo obtener su ubicacion' : 'Could not get your location'}
          </p>
        )}

        {/* Results count - announced to screen readers */}
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }} role="status" aria-live="polite">
          {filteredResources.length} {filteredResources.length !== 1 ? t.resources : t.resource}
          {query && ` ${t.forQuery} "${query}"`}
          {category && ` ${t.inCategory} ${getCatName(category)}`}
        </p>

        {/* Results */}
        <section aria-label={t.resultsLabel}>
          {filteredResources.length > 0 ? (
            <ul className="space-y-4" role="list">
              {filteredResources.map((resource) => {
                const name = language === 'es' && resource.nameEs ? resource.nameEs : resource.name
                const description = language === 'es' && resource.descriptionEs ? resource.descriptionEs : resource.description
                return (
                  <li key={resource.id}>
                    <Link href={`/resources/${resource.id}`} className="card block">
                      <div className="flex gap-2 mb-2 items-center">
                        {resource.categories.slice(0, 2).map((cat) => {
                          const catInfo = cats.find(c => c.slug === cat)
                          return (
                            <span key={cat} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                              <span aria-hidden="true">{catInfo?.icon}</span> {catInfo?.name}
                            </span>
                          )
                        })}
                      </div>
                      <h3 className="font-semibold text-[15px] mb-1">{name}</h3>
                      {resource.organization && resource.organization !== resource.name && (
                        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{resource.organization}</p>
                      )}
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          {resource.phone && (
                            <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{resource.phone}</span>
                          )}
                          {resource.distance != null && resource.distance < 100 && (
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              {resource.distance.toFixed(1)} mi
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                          {language === 'es' ? 'Ver detalles →' : 'Learn more →'}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="text-center py-16" role="status">
              <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
              <h2 className="text-xl font-semibold mb-2">{t.noResults}</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>{t.tryDifferent}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
