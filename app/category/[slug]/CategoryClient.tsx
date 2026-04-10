'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { getCategoryInfo } from '@/lib/categories'
import { getTranslation } from '@/lib/translations'

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
}

interface Props {
  slug: string
  resources: Resource[]
}

const content = {
  en: {
    resources: 'resources',
    resource: 'resource',
    inCategory: 'in',
    noResources: 'No resources yet',
    stillAdding: 'We\'re still adding',
    resourcesWord: 'resources',
    browseAll: 'Browse all resources',
    needHelp: 'Need help finding',
    call211: 'Call 211',
  },
  es: {
    resources: 'recursos',
    resource: 'recurso',
    inCategory: 'en',
    noResources: 'Aún no hay recursos',
    stillAdding: 'Todavía estamos agregando recursos de',
    resourcesWord: '',
    browseAll: 'Ver todos los recursos',
    needHelp: '¿Necesita ayuda para encontrar recursos de',
    call211: 'Llame al 211',
  }
}

export default function CategoryClient({ slug, resources }: Props) {
  const { language } = useLanguage()
  const t = content[language]

  const category = getCategoryInfo(slug, language)
  if (!category) return null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-2xl">{category.icon}</span>
            <h1 className="text-xl font-semibold">{category.name}</h1>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-6 fade-in">
        {/* Results count + print */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {resources.length} {resources.length !== 1 ? t.resources : t.resource} {t.inCategory} {category.name}
          </p>
          {resources.length > 0 && (
            <button
              onClick={() => window.print()}
              className="print-hide text-sm flex items-center gap-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {getTranslation(language, 'printList')}
            </button>
          )}
        </div>

        {/* Results */}
        {resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource) => {
              const name = language === 'es' && resource.nameEs ? resource.nameEs : resource.name
              const description = language === 'es' && resource.descriptionEs ? resource.descriptionEs : resource.description

              return (
                <Link key={resource.id} href={`/resources/${resource.id}`} className="card block">
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
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{t.noResources}</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {t.stillAdding} {category.name.toLowerCase()} {t.resourcesWord}
            </p>
            <Link href="/resources" className="btn-secondary">{t.browseAll}</Link>
          </div>
        )}

        {/* Call 211 CTA */}
        <div className="mt-8 cta-card">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            {t.needHelp} {category.name.toLowerCase()}?
          </p>
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
