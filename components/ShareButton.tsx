'use client'

import { useLanguage } from '@/components/LanguageContext'

interface ShareButtonProps {
  title: string
  text: string
  phone?: string | null
}

export default function ShareButton({ title, text, phone }: ShareButtonProps) {
  const { t } = useLanguage()

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href
      })
    }
  }

  // Build SMS body with resource name, phone, and link
  const smsBody = [
    title,
    phone ? `Phone: ${phone}` : null,
    typeof window !== 'undefined' ? window.location.href : '',
  ].filter(Boolean).join('\n')

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleShare}
        className="text-sm flex items-center gap-1.5"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {t('shareResource')}
      </button>
      <a
        href={`sms:?body=${encodeURIComponent(smsBody)}`}
        className="text-sm flex items-center gap-1.5"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {t('textResource')}
      </a>
    </div>
  )
}
