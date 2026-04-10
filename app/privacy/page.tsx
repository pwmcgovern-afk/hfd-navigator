'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold mb-6">{isEs ? 'Politica de Privacidad' : 'Privacy Policy'}</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{isEs ? 'Ultima actualizacion: Abril 2026' : 'Last updated: April 2026'}</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Que datos recopilamos' : 'What data we collect'}</h2>
        <p>{isEs
          ? 'Hartford Navigator esta disenado para proteger su privacidad. NO recopilamos informacion personal identificable (PII) como nombre, email, numero de telefono o direccion.'
          : 'Hartford Navigator is designed to protect your privacy. We do NOT collect personally identifiable information (PII) such as your name, email, phone number, or address.'
        }</p>

        <p className="mt-3 font-medium">{isEs ? 'Lo que SI recopilamos:' : 'What we DO collect:'}</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>{isEs
            ? 'Vistas de pagina anonimas — que paginas se visitan (sin identificar quien)'
            : 'Anonymous page views — which pages are visited (not who visits them)'
          }</li>
          <li>{isEs
            ? 'Comentarios anonimos — cuando marca un recurso como util o no util'
            : 'Anonymous feedback — when you mark a resource as helpful or not helpful'
          }</li>
          <li>{isEs
            ? 'Datos del rastreador — si usa el rastreador de recursos, sus entradas se guardan localmente en su navegador y opcionalmente se sincronizan con nuestro servidor usando un identificador anonimo'
            : 'Tracker data — if you use the resource tracker, your entries are stored locally in your browser and optionally synced to our server using an anonymous identifier'
          }</li>
          <li>{isEs
            ? 'Mensajes de chat — las conversaciones con nuestro asistente de IA se procesan pero no se almacenan permanentemente'
            : 'Chat messages — conversations with our AI assistant are processed but not permanently stored'
          }</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Servicios de terceros' : 'Third-party services'}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Vercel</strong> — {isEs ? 'Aloja nuestra aplicacion y proporciona analisis basicos' : 'Hosts our application and provides basic analytics'}</li>
          <li><strong>Supabase</strong> — {isEs ? 'Almacena datos de recursos (no datos personales)' : 'Stores resource data (not personal data)'}</li>
          <li><strong>Anthropic (Claude)</strong> — {isEs ? 'Procesa consultas del asistente de chat' : 'Processes chat assistant queries'}</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Retencion de datos' : 'Data retention'}</h2>
        <p>{isEs
          ? 'Los datos del rastreador se almacenan en su navegador y se pueden eliminar en cualquier momento borrando los datos de su navegador. Los datos del servidor se conservan indefinidamente pero no contienen informacion personal identificable.'
          : 'Tracker data is stored in your browser and can be deleted at any time by clearing your browser data. Server-side data is retained indefinitely but contains no personally identifiable information.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Sus derechos' : 'Your rights'}</h2>
        <p>{isEs
          ? 'Puede borrar sus datos del rastreador en cualquier momento borrando el almacenamiento local de su navegador. Para solicitar la eliminacion de datos del servidor, contacte a pwmcgovern@gmail.com.'
          : 'You can delete your tracker data at any time by clearing your browser\'s local storage. To request deletion of server-side data, contact pwmcgovern@gmail.com.'
        }</p>

        <h2 className="text-lg font-semibold mt-6 mb-3">{isEs ? 'Contacto' : 'Contact'}</h2>
        <p>{isEs
          ? 'Si tiene preguntas sobre esta politica de privacidad, contacte a:'
          : 'If you have questions about this privacy policy, contact:'
        }</p>
        <p className="mt-2"><a href="mailto:pwmcgovern@gmail.com" style={{ color: 'var(--color-primary)' }}>pwmcgovern@gmail.com</a></p>
      </main>
    </div>
  )
}
