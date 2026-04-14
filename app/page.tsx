'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { getCategoriesWithDetails } from '@/lib/categories'
import { Button } from '@/components/ui/button'

const content = {
  en: {
    heroTitle: 'Find free help in Hartford',
    heroSub: 'Food, housing, healthcare, legal aid — 97 resources in English and Spanish, all in one place.',
    heroCta: 'Find Resources for Me',
    heroSecondary: 'Browse All Resources',
    browseTitle: 'Browse by Category',
    call211: 'Need help now? Call 211',
    call211Sub: 'Free, confidential, 24/7',
    skipToMain: 'Skip to main content',
    footer: 'A free community resource for Hartford residents. Not affiliated with any government agency.',
    resources: 'resources',
  },
  es: {
    heroTitle: 'Encuentre ayuda gratuita en Hartford',
    heroSub: 'Comida, vivienda, salud, ayuda legal — 97 recursos en ingles y espanol, todo en un solo lugar.',
    heroCta: 'Buscar Recursos',
    heroSecondary: 'Ver Todos los Recursos',
    browseTitle: 'Buscar por Categoria',
    call211: 'Necesita ayuda ahora? Llame al 211',
    call211Sub: 'Gratuito, confidencial, 24/7',
    skipToMain: 'Saltar al contenido principal',
    footer: 'Un recurso comunitario gratuito para residentes de Hartford. No afiliado a ninguna agencia del gobierno.',
    resources: 'recursos',
  }
}


export default function Home() {
  const { language } = useLanguage()
  const t = content[language]
  const cats = getCategoriesWithDetails(language)

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">{t.skipToMain}</a>

      {/* Hero Section — full-width teal background, breaks out of parent max-w-lg */}
      <div style={{
        background: 'linear-gradient(145deg, #0D6E6E 0%, #095252 100%)',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
      }}>
        <div className="max-w-lg mx-auto px-5">
          {/* Header inside hero */}
          <header className="pt-4 pb-2 flex items-center justify-between" role="banner">
            <span className="text-[13px] font-semibold tracking-widest uppercase text-white/70">
              Navigator
            </span>
            <LanguageToggle />
          </header>

          {/* Elm tree icon */}
          <div className="pt-6 pb-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.5 }}>
              {/* Canopy */}
              <ellipse cx="20" cy="14" rx="12" ry="10" fill="white" />
              <ellipse cx="14" cy="16" rx="7" ry="7" fill="white" />
              <ellipse cx="26" cy="16" rx="7" ry="7" fill="white" />
              <ellipse cx="20" cy="10" rx="8" ry="7" fill="white" />
              {/* Trunk */}
              <rect x="18" y="22" width="4" height="14" rx="2" fill="white" />
              {/* Roots */}
              <path d="M16 34 C18 32, 18 36, 20 36 C22 36, 22 32, 24 34" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Hero content */}
          <section className="pb-12" id="main-content">
            <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold leading-[1.1] tracking-tight text-white mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-white/80 pb-2" style={{ maxWidth: '38ch' }}>
              {t.heroSub}
            </p>
          </section>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-5">
        <main className="pb-12" role="main">

          {/* Categories */}
          <section className="pt-8 mb-10" aria-labelledby="browse-heading">
            <h2 id="browse-heading" className="text-lg font-bold mb-5">
              {t.browseTitle}
            </h2>
            <nav aria-label={language === 'en' ? 'Resource categories' : 'Categorias de recursos'}>
              <div className="grid grid-cols-2 gap-3">
                {cats.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-150 hover:border-[var(--color-primary)] hover:shadow-sm"
                    style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}
                    aria-label={category.ariaLabel}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{category.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>{category.name}</div>
                      <div className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{category.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </section>

          {/* CTAs — below categories */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/wizard" className="flex-1">
              <Button size="lg" className="w-full text-[15px] font-semibold h-12 rounded-xl" style={{ background: 'var(--color-primary)', color: 'white' }}>
                {t.heroCta}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Button>
            </Link>
            <Link href="/resources" className="flex-1">
              <Button variant="outline" size="lg" className="w-full text-[15px] font-semibold h-12 rounded-xl">
                {t.heroSecondary}
              </Button>
            </Link>
          </div>

          {/* 211 CTA */}
          <section className="rounded-2xl p-6 mb-6 text-center" style={{ background: '#F0FAF0', border: '1px solid #C8E6C9' }}>
            <a href="tel:211" className="text-lg font-bold" style={{ color: '#2E7D32' }}>
              {t.call211}
            </a>
            <p className="text-sm mt-1" style={{ color: '#558B2F' }}>{t.call211Sub}</p>
          </section>
        </main>

        {/* Footer */}
        <footer className="pb-8 text-center text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }} role="contentinfo">
          {t.footer}
        </footer>
      </div>
    </div>
  )
}
