'use client'

import { useLanguage } from '@/components/LanguageContext'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4" aria-hidden="true">&#9888;&#65039;</div>
        <h1 className="text-2xl font-bold mb-2">{t('errorTitle')}</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {t('errorMessage')}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            {t('tryAgain')}
          </button>
          <a href="/" className="btn-secondary">
            {t('goHome')}
          </a>
        </div>
      </div>
    </div>
  )
}
