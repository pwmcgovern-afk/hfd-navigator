'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function AppFooter() {
  const { language } = useLanguage()
  const isEs = language === 'es'

  return (
    <footer className="px-5 py-6 text-center" style={{ borderTop: '2px solid var(--color-border)' }} role="contentinfo">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        <Link href="/about" className="hover:underline">
          {isEs ? 'Acerca de' : 'About'}
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="hover:underline">
          {isEs ? 'Privacidad' : 'Privacy'}
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/terms" className="hover:underline">
          {isEs ? 'Términos' : 'Terms'}
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/suggest" className="hover:underline">
          {isEs ? 'Sugerir' : 'Suggest Update'}
        </Link>
        <span aria-hidden="true">·</span>
        <a href="mailto:pwmcgovern@gmail.com" className="hover:underline">
          {isEs ? 'Contacto' : 'Contact'}
        </a>
      </div>

      {/* Folio — masthead-style strip showing the family of three sites.
          Current city in primary color; sister cities link out with a
          subtle hairline-on-hover. Replaces the older "Also serving" row. */}
      <div className="folio" aria-label={isEs ? 'Sitios hermanos' : 'Sister sites'}>
        <a
          href="https://www.nhvnavigator.com"
          target="_blank"
          rel="noreferrer"
          className="folio__sister"
        >
          New Haven
        </a>
        <span className="folio__sep" aria-hidden="true">·</span>
        <a
          href="https://www.bptnavigator.com"
          target="_blank"
          rel="noreferrer"
          className="folio__sister"
        >
          Bridgeport
        </a>
        <span className="folio__sep" aria-hidden="true">·</span>
        <span className="folio__current">Hartford</span>
      </div>
      <div className="colophon">
        Navigator · Connecticut social services
      </div>
    </footer>
  )
}
