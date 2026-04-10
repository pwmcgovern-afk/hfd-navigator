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
  hours: string | null
  website: string | null
}

const content = {
  en: {
    defaultTitle: 'Shared Resource List',
    subtitle: 'resources in this list',
    subtitleSingle: 'resource in this list',
    empty: 'This list is empty',
    emptyDesc: 'The link may be outdated or the resources may have been removed.',
    browseAll: 'Browse all resources',
    shareList: 'Share this list',
    textList: 'Text this list',
    print: 'Print',
  },
  es: {
    defaultTitle: 'Lista de Recursos Compartida',
    subtitle: 'recursos en esta lista',
    subtitleSingle: 'recurso en esta lista',
    empty: 'Esta lista esta vacia',
    emptyDesc: 'El enlace puede estar desactualizado o los recursos fueron eliminados.',
    browseAll: 'Ver todos los recursos',
    shareList: 'Compartir esta lista',
    textList: 'Enviar por mensaje',
    print: 'Imprimir',
  }
}

export default function ListClient({ resources, title }: { resources: Resource[]; title: string }) {
  const { language } = useLanguage()
  const t = content[language]

  const displayTitle = title || t.defaultTitle

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: displayTitle, url: window.location.href })
    }
  }

  const smsBody = [
    displayTitle,
    ...resources.map(r => `- ${r.name}${r.phone ? ` (${r.phone})` : ''}`),
    '',
    typeof window !== 'undefined' ? window.location.href : '',
  ].join('\n')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 px-5 py-4" style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/resources" className="p-2 -ml-2 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">{displayTitle}</h1>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-6">
        {resources.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {resources.length} {resources.length !== 1 ? t.subtitle : t.subtitleSingle}
              </p>
              <div className="flex gap-3 print-hide">
                <button onClick={handleShare} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {t.shareList}
                </button>
                <a href={`sms:?body=${encodeURIComponent(smsBody)}`} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {t.textList}
                </a>
                <button onClick={() => window.print()} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {t.print}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {resources.map((resource) => {
                const name = language === 'es' && resource.nameEs ? resource.nameEs : resource.name
                const description = language === 'es' && resource.descriptionEs ? resource.descriptionEs : resource.description

                return (
                  <Link key={resource.id} href={`/resources/${resource.id}`} className="card block">
                    <div className="flex gap-2 mb-2">
                      {resource.categories.slice(0, 2).map(cat => {
                        const info = getCategoryInfo(cat, language)
                        return info ? (
                          <span key={cat} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {info.icon} {info.name}
                          </span>
                        ) : null
                      })}
                    </div>
                    <h3 className="font-semibold text-[15px] mb-1">{name}</h3>
                    {resource.organization && resource.organization !== resource.name && (
                      <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{resource.organization}</p>
                    )}
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      {resource.phone && (
                        <span className="font-medium" style={{ color: 'var(--color-primary)' }}>{resource.phone}</span>
                      )}
                      {resource.address && (
                        <span style={{ color: 'var(--color-text-muted)' }}>{resource.address}</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4" aria-hidden="true">📋</div>
            <h2 className="text-xl font-semibold mb-2">{t.empty}</h2>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.emptyDesc}</p>
            <Link href="/resources" className="btn-primary">{t.browseAll}</Link>
          </div>
        )}
      </main>
    </div>
  )
}
