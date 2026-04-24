'use client'

import { useLanguage } from '@/components/LanguageContext'
import PageHeader from '@/components/PageHeader'

export default function PrivacyPage() {
  const { language } = useLanguage()
  const isEs = language === 'es'

  return (
    <div className="min-h-screen">
      <PageHeader
        back="/"
        backLabel={isEs ? 'Volver al inicio' : 'Back to home'}
        edition="Hartford, CT"
        eyebrow={isEs ? 'Política' : 'Policy'}
        title={isEs ? 'Política de Privacidad' : 'Privacy Policy'}
      />

      <main className="px-5 pb-12 editorial-prose" style={{ color: 'var(--color-text)' }} role="main" id="main-content">
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{isEs ? 'Última actualización: Abril 2026' : 'Last updated: April 2026'}</p>

        <section>
          <h2>{isEs ? 'Qué datos recopilamos' : 'What data we collect'}</h2>
          <p>{isEs
            ? 'Hartford Navigator está diseñado para proteger su privacidad. NO recopilamos información personal identificable (PII) como nombre, email, número de teléfono o dirección.'
            : 'Hartford Navigator is designed to protect your privacy. We do NOT collect personally identifiable information (PII) such as your name, email, phone number, or address.'
          }</p>

          <p className="mt-3 font-medium">{isEs ? 'Lo que SÍ recopilamos:' : 'What we DO collect:'}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>{isEs ? 'Vistas de página anónimas — qué páginas se visitan (sin identificar quién)' : 'Anonymous page views — which pages are visited (not who visits them)'}</li>
            <li>{isEs ? 'Comentarios anónimos — cuando marca un recurso como útil o no útil' : 'Anonymous feedback — when you mark a resource as helpful or not helpful'}</li>
            <li>{isEs ? 'Datos del rastreador — si usa el rastreador de recursos, sus entradas se guardan localmente en su navegador y opcionalmente se sincronizan con nuestro servidor usando un identificador anónimo' : 'Tracker data — if you use the resource tracker, your entries are stored locally in your browser and optionally synced to our server using an anonymous identifier'}</li>
            <li>{isEs ? 'Mensajes de chat — las conversaciones con nuestro asistente de IA se procesan pero no se almacenan permanentemente' : 'Chat messages — conversations with our AI assistant are processed but not permanently stored'}</li>
          </ul>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Servicios de terceros' : 'Third-party services'}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Vercel</strong> — {isEs ? 'Aloja nuestra aplicación y proporciona análisis básicos' : 'Hosts our application and provides basic analytics'}</li>
            <li><strong>Supabase</strong> — {isEs ? 'Almacena datos de recursos (no datos personales)' : 'Stores resource data (not personal data)'}</li>
            <li><strong>Anthropic (Claude)</strong> — {isEs ? 'Procesa consultas del asistente de chat' : 'Processes chat assistant queries'}</li>
          </ul>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Retención de datos' : 'Data retention'}</h2>
          <p>{isEs
            ? 'Los datos del rastreador se almacenan en su navegador y se pueden eliminar en cualquier momento borrando los datos de su navegador. Los datos del servidor se conservan indefinidamente pero no contienen información personal identificable.'
            : 'Tracker data is stored in your browser and can be deleted at any time by clearing your browser data. Server-side data is retained indefinitely but contains no personally identifiable information.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Sus derechos' : 'Your rights'}</h2>
          <p>{isEs
            ? 'Puede borrar sus datos del rastreador en cualquier momento borrando el almacenamiento local de su navegador. Para solicitar la eliminación de datos del servidor, contacte a pwmcgovern@gmail.com.'
            : 'You can delete your tracker data at any time by clearing your browser\'s local storage. To request deletion of server-side data, contact pwmcgovern@gmail.com.'
          }</p>
        </section>

        <div className="section-rule" aria-hidden="true">⁂</div>

        <section>
          <h2>{isEs ? 'Contacto' : 'Contact'}</h2>
          <p>{isEs ? 'Si tiene preguntas sobre esta política de privacidad, contacte a:' : 'If you have questions about this privacy policy, contact:'}</p>
          <p className="mt-2"><a href="mailto:pwmcgovern@gmail.com" style={{ color: 'var(--color-primary)' }}>pwmcgovern@gmail.com</a></p>
        </section>
      </main>
    </div>
  )
}
