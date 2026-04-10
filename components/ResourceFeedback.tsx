'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

const feedbackContent = {
  en: {
    question: 'Was this helpful?',
    thanks: 'Thanks for your feedback!',
    yes: 'Yes',
    no: 'No',
  },
  es: {
    question: 'Fue util esta informacion?',
    thanks: 'Gracias por sus comentarios!',
    yes: 'Si',
    no: 'No',
  }
}

export default function ResourceFeedback({ resourceId }: { resourceId: string }) {
  const { language } = useLanguage()
  const t = feedbackContent[language]
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = async (helpful: boolean) => {
    setSubmitted(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, helpful }),
      })
    } catch {
      // Feedback is best-effort — don't block the user
    }
  }

  if (submitted) {
    return (
      <div className="mt-6 py-4 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {t.thanks}
      </div>
    )
  }

  return (
    <div className="mt-6 py-4 flex items-center justify-center gap-4">
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.question}</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback(true)}
          className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}
          aria-label={t.yes}
        >
          <span aria-hidden="true">&#128077;</span> {t.yes}
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{ background: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          aria-label={t.no}
        >
          <span aria-hidden="true">&#128078;</span> {t.no}
        </button>
      </div>
    </div>
  )
}
