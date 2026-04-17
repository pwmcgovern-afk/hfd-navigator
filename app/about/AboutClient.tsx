'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

const copy = {
  en: {
    back: 'Back to home',
    title: 'About Hartford Navigator',
    lede: 'A free, bilingual directory of social services in Hartford — built so residents can find help in minutes, not hours.',
    whySection: 'Why it exists',
    whyBody:
      'If you are looking for help with rent, food, or healthcare in Hartford, the answer usually means calling 211, sitting through a phone menu, and hoping the counselor knows the one agency that fits your situation. Information is scattered across agency websites, 211 PDFs, and word of mouth. Spanish-speaking residents have it worse — most existing directories are English-only.',
    whyBody2: 'Navigator exists to make the first 10 minutes of searching not painful.',
    whatSection: 'What it does',
    whatBullets: [
      { t: 'Browse or search local resources', d: 'Food, housing, healthcare, cash, legal, immigration, and more — verified and updated on a rolling basis.' },
      { t: 'Ask the AI assistant', d: 'Explain your situation in plain language and get recommendations with phone numbers, addresses, and a link to each resource. Works in English and Spanish.' },
      { t: 'Take the eligibility quiz', d: 'A 7-step questionnaire filters resources to ones you likely qualify for, with a plain explanation of why each was matched.' },
      { t: 'Track your outreach', d: 'Save resources you have contacted and note what happened (waitlisted, connected, denied) so you do not have to remember on your own.' },
    ],
    howSection: 'How it works',
    howBody:
      'The AI assistant is powered by Claude Sonnet 4.6. Instead of stuffing every resource into the prompt, the model calls search tools that query the Navigator directory on demand — so it can refine a search based on what you tell it, and never invent resources that do not exist. Every recommendation links back to a verified entry in the directory.',
    privacySection: 'Privacy',
    privacyBody:
      'Navigator does not require an account. The tracker uses an anonymous token stored on your device, synced to our server without any personal information. We do not sell or share data. Full details in our',
    privacyLink: 'privacy policy',
    sistersSection: 'Part of a family',
    sistersBody: 'Navigator also runs in New Haven and Bridgeport, with the same approach: a free, bilingual directory of local resources, an AI assistant grounded in real listings, and an eligibility quiz.',
    sistersNhv: 'New Haven Navigator',
    sistersBpt: 'Bridgeport Navigator',
    whoSection: 'Who built this',
    whoBody:
      'Navigator is a community project, not affiliated with any government agency. If you spot out-of-date information, use the',
    whoLinkSuggest: 'Suggest an Update',
    whoBody2: 'page or email us directly. Code is on',
    whoLinkGithub: 'GitHub',
    ctaTitle: 'Start here',
    ctaWizard: 'Take the quiz',
    ctaBrowse: 'Browse resources',
    crisisTitle: 'In crisis right now?',
    crisisBody: 'Call or text 988 for the Suicide & Crisis Lifeline. Call 911 if you are in immediate danger.',
  },
  es: {
    back: 'Volver al inicio',
    title: 'Acerca de Hartford Navigator',
    lede: 'Un directorio gratuito y bilingüe de servicios sociales en Hartford — creado para que los residentes encuentren ayuda en minutos, no en horas.',
    whySection: 'Por qué existe',
    whyBody:
      'Si busca ayuda con el alquiler, comida o atención médica en Hartford, la respuesta normalmente implica llamar al 211, esperar en un menú telefónico y confiar en que el consejero conozca la agencia adecuada. La información está dispersa en sitios web, PDFs del 211 y el boca a boca. Los hispanohablantes lo tienen peor — la mayoría de los directorios existentes solo están en inglés.',
    whyBody2: 'Navigator existe para que los primeros 10 minutos de búsqueda no sean dolorosos.',
    whatSection: 'Qué hace',
    whatBullets: [
      { t: 'Explore o busque recursos locales', d: 'Comida, vivienda, salud, dinero, ayuda legal, inmigración y más — verificados y actualizados regularmente.' },
      { t: 'Pregunte al asistente de IA', d: 'Explique su situación en lenguaje sencillo y reciba recomendaciones con números de teléfono, direcciones y un enlace a cada recurso. Funciona en inglés y español.' },
      { t: 'Tome el cuestionario de elegibilidad', d: 'Un cuestionario de 7 pasos filtra los recursos a los que probablemente califique, con una explicación clara de por qué.' },
      { t: 'Haga seguimiento de su gestión', d: 'Guarde los recursos que ha contactado y anote qué pasó (en lista de espera, conectado, denegado) para no tener que recordarlo usted solo.' },
    ],
    howSection: 'Cómo funciona',
    howBody:
      'El asistente de IA usa Claude Sonnet 4.6. En lugar de incluir todos los recursos en el prompt, el modelo llama a herramientas de búsqueda que consultan el directorio bajo demanda — así puede refinar una búsqueda en función de lo que usted cuente, y nunca inventa recursos que no existen. Cada recomendación enlaza a una entrada verificada del directorio.',
    privacySection: 'Privacidad',
    privacyBody:
      'Navigator no requiere cuenta. El rastreador usa un token anónimo almacenado en su dispositivo, sincronizado a nuestro servidor sin información personal. No vendemos ni compartimos datos. Detalles completos en nuestra',
    privacyLink: 'política de privacidad',
    sistersSection: 'Parte de una familia',
    sistersBody: 'Navigator también funciona en New Haven y Bridgeport, con el mismo enfoque: un directorio gratuito y bilingüe de recursos locales, un asistente de IA basado en listados reales y un cuestionario de elegibilidad.',
    sistersNhv: 'New Haven Navigator',
    sistersBpt: 'Bridgeport Navigator',
    whoSection: 'Quién lo construyó',
    whoBody:
      'Navigator es un proyecto comunitario, no afiliado con ninguna agencia del gobierno. Si encuentra información desactualizada, use la página',
    whoLinkSuggest: 'Sugerir una actualización',
    whoBody2: 'o contáctenos directamente. El código está en',
    whoLinkGithub: 'GitHub',
    ctaTitle: 'Empiece aquí',
    ctaWizard: 'Tomar el cuestionario',
    ctaBrowse: 'Explorar recursos',
    crisisTitle: '¿En crisis ahora mismo?',
    crisisBody: 'Llame o envíe un mensaje al 988 para la Línea de Prevención del Suicidio. Llame al 911 si está en peligro inmediato.',
  },
} as const

export default function AboutClient() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 px-5 py-4" style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }} role="banner">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-lg flex items-center gap-1"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label={t.back}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{t.back}</span>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-8" role="main" id="main-content">
        <h1 className="text-3xl font-extrabold mb-4 leading-tight">{t.title}</h1>
        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          {t.lede}
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t.whySection}</h2>
          <p className="mb-4">{t.whyBody}</p>
          <p className="font-medium">{t.whyBody2}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">{t.whatSection}</h2>
          <ul className="space-y-4">
            {t.whatBullets.map((b, i) => (
              <li key={i} className="card-flat">
                <h3 className="font-semibold mb-1">{b.t}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{b.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t.howSection}</h2>
          <p>{t.howBody}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t.privacySection}</h2>
          <p>
            {t.privacyBody}{' '}
            <Link href="/privacy" style={{ color: 'var(--color-primary)' }} className="font-medium">
              {t.privacyLink}
            </Link>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t.sistersSection}</h2>
          <p className="mb-4">{t.sistersBody}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.nhvnavigator.com"
              target="_blank"
              rel="noreferrer"
              className="card-flat flex-1 hover:border-[var(--color-primary)] transition-colors"
            >
              <span className="font-semibold block">{t.sistersNhv}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>nhvnavigator.com</span>
            </a>
            <a
              href="https://www.bptnavigator.com"
              target="_blank"
              rel="noreferrer"
              className="card-flat flex-1 hover:border-[var(--color-primary)] transition-colors"
            >
              <span className="font-semibold block">{t.sistersBpt}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>bptnavigator.com</span>
            </a>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t.whoSection}</h2>
          <p>
            {t.whoBody}{' '}
            <Link href="/suggest" style={{ color: 'var(--color-primary)' }} className="font-medium">
              {t.whoLinkSuggest}
            </Link>{' '}
            {t.whoBody2}{' '}
            <a
              href="https://github.com/pwmcgovern-afk/hfd-navigator"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)' }}
              className="font-medium"
            >
              {t.whoLinkGithub}
            </a>
            .
          </p>
        </section>

        <section className="info-card error mb-10" role="note">
          <h2 className="font-bold mb-1">{t.crisisTitle}</h2>
          <p className="text-sm">{t.crisisBody}</p>
        </section>

        <section aria-labelledby="cta-title">
          <h2 id="cta-title" className="text-xl font-bold mb-4">{t.ctaTitle}</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/wizard" className="btn-primary flex-1">{t.ctaWizard}</Link>
            <Link href="/resources" className="btn-outline-lg flex-1">{t.ctaBrowse}</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
