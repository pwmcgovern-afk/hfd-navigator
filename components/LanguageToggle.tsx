'use client'

import { useLanguage } from './LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="lang-toggle" role="group" aria-label={language === 'en' ? 'Language selection' : 'Selección de idioma'}>
      <button
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'active' : ''}
        aria-pressed={language === 'en'}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={language === 'es' ? 'active' : ''}
        aria-pressed={language === 'es'}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  )
}
