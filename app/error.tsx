'use client'

import { useEffect, useState } from 'react'
import * as Sentry from '@sentry/nextjs'

// Error boundaries can fire when the LanguageProvider itself fails, so we
// avoid useLanguage() here and read the persisted preference directly. If
// nothing is set or the read throws (SSR, restricted storage), we fall back
// to English copy — the goal is that this screen always renders.
const COPY = {
  en: {
    title: 'Something went wrong',
    message: "Sorry — we hit an unexpected problem. You can try again or go back home.",
    tryAgain: 'Try again',
    goHome: 'Go home',
  },
  es: {
    title: 'Algo salió mal',
    message: 'Lo sentimos — ocurrió un problema inesperado. Puede intentarlo de nuevo o volver al inicio.',
    tryAgain: 'Intentar de nuevo',
    goHome: 'Ir al inicio',
  },
} as const

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [lang, setLang] = useState<'en' | 'es'>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language')
      if (saved === 'es') setLang('es')
    } catch {
      // localStorage may be blocked — keep the default
    }
    // Capture for observability. Sentry no-ops when NEXT_PUBLIC_SENTRY_DSN
    // is unset, so this stays cheap until Pat wires the DSN.
    Sentry.captureException(error)
    console.error('App error boundary:', error)
  }, [error])

  const t = COPY[lang]

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4" aria-hidden="true">&#9888;&#65039;</div>
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {t.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            {t.tryAgain}
          </button>
          <a href="/" className="btn-secondary">
            {t.goHome}
          </a>
        </div>
      </div>
    </div>
  )
}
