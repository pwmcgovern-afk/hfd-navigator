'use client'

import { useLanguage } from '@/components/LanguageContext'
import PageHeader from '@/components/PageHeader'

export default function TermsPage() {
  const { language } = useLanguage()
  const isEs = language === 'es'

  return (
    <div className="min-h-screen">
      <PageHeader
        back="/"
        backLabel={isEs ? 'Volver al inicio' : 'Back to home'}
        edition="Hartford, CT"
        eyebrow={isEs ? 'Términos' : 'Terms'}
        title={isEs ? 'Términos de Uso' : 'Terms of Use'}
      />

      <main className="px-5 pb-12 editorial-prose" style={{ color: 'var(--color-text)' }} role="main" id="main-content">
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{isEs ? 'Última actualización: Abril 2026' : 'Last updated: April 2026'}</p>

        <section>
          <h2>{isEs ? 'Acerca de este servicio' : 'About this service'}</h2>
          <p>{isEs
            ? 'Hartford Navigator es un directorio comunitario gratuito de servicios sociales para los residentes del área de Hartford, CT. No es una agencia gubernamental y no está afiliado a ningún proveedor de servicios listado.'
            : 'Hartford Navigator is a free community directory of social services for residents of the greater Hartford, CT area. It is not a government agency and is not affiliated with any listed service provider.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Precisión de la información' : 'Information accuracy'}</h2>
          <p>{isEs
            ? 'Hacemos nuestro mejor esfuerzo para mantener la información de los recursos actualizada y precisa. Sin embargo, los detalles de los servicios (horarios, elegibilidad, disponibilidad) pueden cambiar sin previo aviso. Siempre verifique directamente con la organización antes de visitarla.'
            : 'We make our best effort to keep resource information current and accurate. However, service details (hours, eligibility, availability) may change without notice. Always verify directly with the organization before visiting.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'No es consejo médico o legal' : 'Not medical or legal advice'}</h2>
          <p>{isEs
            ? 'La información en esta aplicación, incluyendo las respuestas del asistente de chat, es solo para fines informativos. No constituye consejo médico, legal o profesional. Para emergencias, llame al 911. Para crisis de salud mental, llame al 988.'
            : 'Information on this app, including chat assistant responses, is for informational purposes only. It does not constitute medical, legal, or professional advice. For emergencies, call 911. For mental health crises, call 988.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Asistente de IA' : 'AI assistant'}</h2>
          <p>{isEs
            ? 'El asistente de chat utiliza inteligencia artificial para ayudarle a encontrar recursos. Solo recomienda servicios de nuestra base de datos, pero sus respuestas pueden no ser siempre perfectas. Use su criterio y verifique la información directamente.'
            : 'The chat assistant uses artificial intelligence to help you find resources. It only recommends services from our database, but its responses may not always be perfect. Use your judgment and verify information directly.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Organizaciones listadas' : 'Listed organizations'}</h2>
          <p>{isEs
            ? 'Si su organización está listada y desea actualizar su información, use la página &ldquo;Sugerir actualización&rdquo; o contáctenos directamente.'
            : 'If your organization is listed and you would like to update your information, use the &ldquo;Suggest Update&rdquo; page or contact us directly.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Contacto' : 'Contact'}</h2>
          <p><a href="mailto:pwmcgovern@gmail.com" style={{ color: 'var(--color-primary)' }}>pwmcgovern@gmail.com</a></p>
        </section>
      </main>
    </div>
  )
}
