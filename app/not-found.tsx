'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4" aria-hidden="true">&#128269;</div>
        <h1 className="text-2xl font-bold mb-2">{t('notFoundTitle')}</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {t('notFoundMessage')}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">
            {t('goHome')}
          </Link>
          <Link href="/resources" className="btn-secondary">
            {t('browseResources')}
          </Link>
        </div>
      </div>
    </div>
  )
}
