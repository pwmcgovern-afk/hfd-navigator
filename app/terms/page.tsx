'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

export default function TermsPage() {
  const { language } = useLanguage()
  const isEs = language === 'es'

  return (
    <div className="min-h-screen">
      <header className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '2px solid var(--color-border)' }}>
        <Link href="/" className="p-2 -ml-2 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <LanguageToggle />
      </header>

      <main className="px-5 py-8 prose prose-sm max-w-none" style={{ color: 'var(--color-text)' }}>
        <h1 className="text-2xl font-bold mb-6">{isEs ? 'Terminos de Uso' : 'Terms of Use'}</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{isEs ? 'Ultima actualizacion: Abril 2026' : 'Last updated: April 2026'}</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Acerca de este servicio' : 'About this service'}</h2>
        <p>{isEs
          ? 'Hartford Navigator es un directorio comunitario gratuito de servicios sociales para los residentes del area de Hartford, CT. No es una agencia gubernamental y no esta afiliado a ningun proveedor de servicios listado.'
          : 'Hartford Navigator is a free community directory of social services for residents of the greater Hartford, CT area. It is not a government agency and is not affiliated with any listed service provider.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Precision de la informacion' : 'Information accuracy'}</h2>
        <p>{isEs
          ? 'Hacemos nuestro mejor esfuerzo para mantener la informacion de los recursos actualizada y precisa. Sin embargo, los detalles de los servicios (horarios, elegibilidad, disponibilidad) pueden cambiar sin previo aviso. Siempre verifique directamente con la organizacion antes de visitarla.'
          : 'We make our best effort to keep resource information current and accurate. However, service details (hours, eligibility, availability) may change without notice. Always verify directly with the organization before visiting.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'No es consejo medico o legal' : 'Not medical or legal advice'}</h2>
        <p>{isEs
          ? 'La informacion en esta aplicacion, incluyendo las respuestas del asistente de chat, es solo para fines informativos. No constituye consejo medico, legal o profesional. Para emergencias, llame al 911. Para crisis de salud mental, llame al 988.'
          : 'Information on this app, including chat assistant responses, is for informational purposes only. It does not constitute medical, legal, or professional advice. For emergencies, call 911. For mental health crises, call 988.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Asistente de IA' : 'AI assistant'}</h2>
        <p>{isEs
          ? 'El asistente de chat utiliza inteligencia artificial para ayudarle a encontrar recursos. Solo recomienda servicios de nuestra base de datos, pero sus respuestas pueden no ser siempre perfectas. Use su criterio y verifique la informacion directamente.'
          : 'The chat assistant uses artificial intelligence to help you find resources. It only recommends services from our database, but its responses may not always be perfect. Use your judgment and verify information directly.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Organizaciones listadas' : 'Listed organizations'}</h2>
        <p>{isEs
          ? 'Si su organizacion esta listada y desea actualizar su informacion, use la pagina "Sugerir actualizacion" o contactenos directamente.'
          : 'If your organization is listed and you would like to update your information, use the "Suggest Update" page or contact us directly.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Contacto' : 'Contact'}</h2>
        <p><a href="mailto:pwmcgovern@gmail.com" style={{ color: 'var(--color-primary)' }}>pwmcgovern@gmail.com</a></p>
      </main>
    </div>
  )
}
