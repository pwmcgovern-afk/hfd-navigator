'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { getCategoryInfo } from '@/lib/categories'
import { getTranslation } from '@/lib/translations'

import type { MatchReason } from '@/lib/eligibility'

interface Resource {
  id: string
  name: string
  nameEs?: string | null
  organization?: string | null
  description: string
  descriptionEs?: string | null
  categories: string[]
  address?: string | null
  phone?: string | null
  score: number
  matchReasons?: MatchReason[]
}

interface Props {
  resources: Resource[]
  selectedCategories: string[]
}

const content = {
  en: {
    title: 'Your Resources',
    resourcesMatch: 'resources match your situation',
    resourceMatch: 'resource matches your situation',
    editAnswers: 'Edit answers',
    noMatches: 'No matches found',
    noMatchesDesc: 'Try adjusting your answers or browse all resources',
    tryAgain: 'Try again',
    browseAll: 'Browse all',
    needMoreHelp: 'Need more help?',
    call211: 'Call 211 for personalized assistance',
    goodMatch: 'Good match',
  },
  es: {
    title: 'Sus Recursos',
    resourcesMatch: 'recursos coinciden con su situación',
    resourceMatch: 'recurso coincide con su situación',
    editAnswers: 'Editar respuestas',
    noMatches: 'No se encontraron coincidencias',
    noMatchesDesc: 'Intente ajustar sus respuestas o explore todos los recursos',
    tryAgain: 'Intentar de nuevo',
    browseAll: 'Ver todos',
    needMoreHelp: '¿Necesita más ayuda?',
    call211: 'Llame al 211 para asistencia personalizada',
    goodMatch: 'Buena coincidencia',
  }
}

export default function ResultsClient({ resources, selectedCategories }: Props) {
  const { language } = useLanguage()
  const t = content[language]

  const getCatInfo = (slug: string) => getCategoryInfo(slug, language)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center justify-between">
          <Link href="/wizard" className="text-[var(--color-primary)] text-sm font-medium inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.editAnswers}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-6 fade-in">
        {/* Title + print */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          {resources.length > 0 && (
            <button
              onClick={() => window.print()}
              className="print-hide text-sm flex items-center gap-1.5 mt-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {getTranslation(language, 'printList')}
            </button>
          )}
        </div>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {resources.length} {resources.length !== 1 ? t.resourcesMatch : t.resourceMatch}
        </p>

        {/* Selected category pills */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((slug) => {
              const cat = getCatInfo(slug)
              return cat ? (
                <span key={slug} className="category-pill active">
                  {cat.icon} {cat.name}
                </span>
              ) : null
            })}
          </div>
        )}

        {/* Results */}
        {resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource) => {
              const name = language === 'es' && resource.nameEs ? resource.nameEs : resource.name
              const description = language === 'es' && resource.descriptionEs ? resource.descriptionEs : resource.description

              return (
                <Link key={resource.id} href={`/resources/${resource.id}`} className="card block">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex gap-2">
                      {resource.categories.slice(0, 2).map((cat) => {
                        const catInfo = getCatInfo(cat)
                        return (
                          <span key={cat} className="text-xs text-[var(--color-text-secondary)]">
                            {catInfo?.icon} {catInfo?.name}
                          </span>
                        )
                      })}
                    </div>
                    {resource.score >= 70 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--color-success)', background: 'var(--color-success-light)' }}>
                        {t.goodMatch}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[15px] mb-1">{name}</h3>
                  {resource.organization && resource.organization !== resource.name && (
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">{resource.organization}</p>
                  )}
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{description}</p>
                  <div className="flex items-center justify-between mt-3">
                    {resource.phone && (
                      <span className="text-sm text-[var(--color-primary)] font-medium">{resource.phone}</span>
                    )}
                    <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                      {language === 'es' ? 'Ver detalles →' : 'Learn more →'}
                    </span>
                  </div>
                  {resource.matchReasons && resource.matchReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {resource.matchReasons.filter(r => r.type === 'match').slice(0, 3).map((reason, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                          {reason.message}
                        </span>
                      ))}
                      {resource.matchReasons.filter(r => r.type === 'warning').slice(0, 2).map((reason, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>
                          {reason.message}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">{t.noMatches}</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">{t.noMatchesDesc}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/wizard" className="btn-secondary">{t.tryAgain}</Link>
              <Link href="/resources" className="btn-primary">{t.browseAll}</Link>
            </div>
          </div>
        )}

        {/* Call 211 CTA */}
        <div className="mt-8 cta-card">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">{t.needMoreHelp}</p>
          <a href="tel:211" className="btn-phone">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t.call211}
          </a>
        </div>
      </main>
    </div>
  )
}
