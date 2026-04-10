'use client'

import { useLanguage } from '@/components/LanguageContext'

const methodLabels: Record<string, { en: string; es: string }> = {
  staff_call: { en: 'via phone call', es: 'por llamada' },
  web_check: { en: 'via web check', es: 'por web' },
  org_confirmed: { en: 'by organization', es: 'por organizacion' },
  '211_import': { en: 'via 211', es: 'via 211' },
  user_reported: { en: 'user reported', es: 'por usuario' },
}

interface FreshnessBadgeProps {
  verifiedAt: Date | string | null
  verificationMethod?: string | null
}

export default function FreshnessBadge({ verifiedAt, verificationMethod }: FreshnessBadgeProps) {
  const { language } = useLanguage()
  const isEs = language === 'es'

  const methodLabel = verificationMethod && methodLabels[verificationMethod]
    ? methodLabels[verificationMethod][language]
    : null

  if (!verifiedAt) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
        style={{ background: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isEs ? 'La info puede estar desactualizada' : 'Info may be outdated'}
      </span>
    )
  }

  const date = typeof verifiedAt === 'string' ? new Date(verifiedAt) : verifiedAt
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const isFresh = date > sixMonthsAgo

  const dateStr = date.toLocaleDateString()
  const suffix = methodLabel ? ` (${methodLabel})` : ''

  if (isFresh) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
        style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {isEs ? 'Verificado' : 'Verified'} {dateStr}{suffix}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
      style={{ background: '#fef3c7', color: '#92400e' }}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {isEs ? 'La info puede estar desactualizada' : 'Info may be outdated'}{suffix}
    </span>
  )
}
