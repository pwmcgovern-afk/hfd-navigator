'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import NavigatorWordmark from '@/components/NavigatorWordmark'
import { getCategoriesWithDetails } from '@/lib/categories'

function buildContent(resourceCount: number) {
  return {
    en: {
      edition: 'Hartford, CT',
      heroEyebrow: 'A free directory for Hartford residents',
      heroTitle: 'Find free help in Hartford',
      heroSub: `Food, housing, healthcare, legal aid — ${resourceCount} resources in English and Spanish, all in one place.`,
      ctaBrowseNum: '01',
      ctaBrowseLabel: 'Browse all resources',
      ctaWizardNum: '02',
      ctaWizardLabel: 'Take the eligibility quiz',
      browseTitle: 'Browse by Category',
      call211: 'Need help now? Call 211',
      call211Sub: 'Free, confidential, 24/7',
      skipToMain: 'Skip to main content',
      footer: 'A free community resource for Hartford residents. Not affiliated with any government agency.',
    },
    es: {
      edition: 'Hartford, CT',
      heroEyebrow: 'Un directorio gratuito para residentes de Hartford',
      heroTitle: 'Encuentre ayuda gratuita en Hartford',
      heroSub: `Comida, vivienda, salud, ayuda legal — ${resourceCount} recursos en inglés y español, todo en un solo lugar.`,
      ctaBrowseNum: '01',
      ctaBrowseLabel: 'Ver todos los recursos',
      ctaWizardNum: '02',
      ctaWizardLabel: 'Tomar el cuestionario',
      browseTitle: 'Buscar por Categoría',
      call211: '¿Necesita ayuda ahora? Llame al 211',
      call211Sub: 'Gratuito, confidencial, 24/7',
      skipToMain: 'Saltar al contenido principal',
      footer: 'Un recurso comunitario gratuito para residentes de Hartford. No afiliado a ninguna agencia del gobierno.',
    }
  }
}


export default function Home({ resourceCount }: { resourceCount: number }) {
  const { language } = useLanguage()
  const t = buildContent(resourceCount)[language]
  const cats = getCategoriesWithDetails(language)

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">{t.skipToMain}</a>

      {/* Editorial hero — parchment ground, dark serif title, city-color mark */}
      <section className="hero">
        <div className="hero__strip">
          <NavigatorWordmark onDark={false} />
          <span className="hero__edition">{t.edition}</span>
          <LanguageToggle />
        </div>

        <div className="hero__grid" id="main-content">
          <div className="hero__copy">
            <p className="hero__eyebrow">{t.heroEyebrow}</p>
            <h1 className="hero__title">{t.heroTitle}</h1>
            <p className="hero__lede">{t.heroSub}</p>
          </div>
          <div className="hero__mark" aria-hidden="true">
            {/* Colophon stamp — parchment-deep circle with hairline border
                holds the city SVG. Same position across all 3 forks so the
                family reads as a publication series. */}
            <div className="hero__stamp">
            {/* Charter Oak — Hartford's iconic white oak. Fills use
                currentColor so the stamp tints with Hartford red. */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="20" cy="13" rx="16" ry="9" fill="currentColor" />
              <ellipse cx="10" cy="15" rx="6" ry="6" fill="currentColor" />
              <ellipse cx="30" cy="15" rx="6" ry="6" fill="currentColor" />
              <ellipse cx="20" cy="8" rx="9" ry="5" fill="currentColor" />
              <ellipse cx="14" cy="20" rx="2.5" ry="2" fill="currentColor" />
              <path d="M17 22 L23 22 L24 33 L16 33 Z" fill="currentColor" />
              <path d="M14 34 C16 32, 18 36, 20 36 C22 36, 24 32, 26 34" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            </div>
          </div>
        </div>

        <div className="hero__rule" />
        <div className="hero__ctas">
          <Link href="/resources" className="btn-editorial">
            <span className="btn-editorial__num">{t.ctaBrowseNum}</span>
            <span className="btn-editorial__label">{t.ctaBrowseLabel}</span>
            <span className="btn-editorial__arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/wizard" className="btn-editorial btn-editorial--outline">
            <span className="btn-editorial__num">{t.ctaWizardNum}</span>
            <span className="btn-editorial__label">{t.ctaWizardLabel}</span>
            <span className="btn-editorial__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-5">
        <main className="pb-12" role="main">

          {/* Categories */}
          <section className="pt-8 mb-10" aria-labelledby="browse-heading">
            <h2 id="browse-heading" className="text-lg font-bold mb-5">
              {t.browseTitle}
            </h2>
            <nav aria-label={language === 'en' ? 'Resource categories' : 'Categorías de recursos'}>
              <div className="grid grid-cols-2 gap-3">
                {cats.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="category-card"
                    aria-label={category.ariaLabel}
                  >
                    <span className="text-3xl shrink-0" aria-hidden="true">{category.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{category.name}</div>
                      <div className="text-xs leading-snug mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{category.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </section>

          {/* Quick Links */}
          <div className="flex gap-3 mb-6">
            <Link href="/tracker" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              My Tracker
            </Link>
          </div>

          {/* 211 CTA */}
          <section className="cta-211 mb-6">
            <a href="tel:211" className="cta-211-call">
              {t.call211}
            </a>
            <p className="cta-211-sub">{t.call211Sub}</p>
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
