'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function AppFooter() {
  const { language } = useLanguage()
  const isEs = language === 'es'

  return (
    <footer className="px-5 py-6 text-center" style={{ borderTop: '2px solid var(--color-border)' }}>
      <div className="flex items-center justify-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        <Link href="/privacy" className="hover:underline">
          {isEs ? 'Privacidad' : 'Privacy'}
        </Link>
        <span>·</span>
        <Link href="/terms" className="hover:underline">
          {isEs ? 'Terminos' : 'Terms'}
        </Link>
        <span>·</span>
        <Link href="/suggest" className="hover:underline">
          {isEs ? 'Sugerir' : 'Suggest Update'}
        </Link>
        <span>·</span>
        <a href="mailto:pwmcgovern@gmail.com" className="hover:underline">
          {isEs ? 'Contacto' : 'Contact'}
        </a>
      </div>
    </footer>
  )
}
