'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { CATEGORIES_I18N } from '@/lib/categories'

const content = {
  en: {
    title: 'Suggest a Resource',
    subtitle: 'Help us keep our directory accurate. Submit a new resource or suggest updates to an existing one.',
    typeNew: 'New Resource',
    typeUpdate: 'Update Existing',
    name: 'Resource Name',
    org: 'Organization',
    description: 'Description',
    categories: 'Categories',
    address: 'Address',
    phone: 'Phone',
    website: 'Website',
    hours: 'Hours',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    yourOrg: 'Your Organization',
    optional: 'Optional',
    whatChanged: 'What needs to be updated?',
    submit: 'Submit Suggestion',
    submitting: 'Submitting...',
    success: 'Thank you! Your suggestion has been submitted for review.',
    error: 'Something went wrong. Please try again.',
    backHome: 'Back to home',
  },
  es: {
    title: 'Sugerir un Recurso',
    subtitle: 'Ayudenos a mantener nuestro directorio actualizado. Envie un nuevo recurso o sugiera actualizaciones a uno existente.',
    typeNew: 'Nuevo Recurso',
    typeUpdate: 'Actualizar Existente',
    name: 'Nombre del Recurso',
    org: 'Organizacion',
    description: 'Descripcion',
    categories: 'Categorias',
    address: 'Direccion',
    phone: 'Telefono',
    website: 'Sitio Web',
    hours: 'Horario',
    yourName: 'Su Nombre',
    yourEmail: 'Su Email',
    yourOrg: 'Su Organizacion',
    optional: 'Opcional',
    whatChanged: 'Que necesita ser actualizado?',
    submit: 'Enviar Sugerencia',
    submitting: 'Enviando...',
    success: 'Gracias! Su sugerencia ha sido enviada para revision.',
    error: 'Algo salio mal. Por favor intente de nuevo.',
    backHome: 'Volver al inicio',
  }
}

export default function SuggestPage() {
  const { language } = useLanguage()
  const t = content[language]
  const [type, setType] = useState<'new' | 'update'>('new')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const [form, setForm] = useState({
    name: '', org: '', description: '', categories: [] as string[],
    address: '', phone: '', website: '', hours: '', whatChanged: '',
    submitterName: '', submitterEmail: '', submitterOrg: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const changes = type === 'new'
        ? { name: form.name, organization: form.org, description: form.description, categories: form.categories, address: form.address, phone: form.phone, website: form.website, hours: form.hours }
        : { whatChanged: form.whatChanged, name: form.name || undefined }

      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          changes,
          submitterName: form.submitterName || null,
          submitterEmail: form.submitterEmail || null,
          submitterOrg: form.submitterOrg || null,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = 'w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4" aria-hidden="true">&#9989;</div>
          <h1 className="text-2xl font-bold mb-2">{t.success}</h1>
          <Link href="/" className="btn-primary inline-block mt-6">{t.backHome}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '2px solid var(--color-border)' }}>
        <Link href="/" className="p-2 -ml-2 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <LanguageToggle />
      </header>

      <main className="px-5 py-8">
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{t.subtitle}</p>

        {/* Type toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setType('new')} className={`category-pill ${type === 'new' ? 'active' : ''}`}>{t.typeNew}</button>
          <button onClick={() => setType('update')} className={`category-pill ${type === 'update' ? 'active' : ''}`}>{t.typeUpdate}</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'new' ? (
            <>
              <input type="text" placeholder={t.name + ' *'} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <input type="text" placeholder={t.org} value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <textarea placeholder={t.description + ' *'} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>{t.categories}</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_I18N.map(cat => (
                    <button key={cat.slug} type="button" onClick={() => setForm(f => ({ ...f, categories: f.categories.includes(cat.slug) ? f.categories.filter(c => c !== cat.slug) : [...f.categories, cat.slug] }))}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${form.categories.includes(cat.slug) ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)]' : ''}`}
                      style={{ borderColor: form.categories.includes(cat.slug) ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                      {cat.icon} {language === 'es' ? cat.es : cat.en}
                    </button>
                  ))}
                </div>
              </div>
              <input type="text" placeholder={t.address} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={t.phone} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
                <input type="text" placeholder={t.hours} value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              </div>
              <input type="url" placeholder={t.website} value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
            </>
          ) : (
            <>
              <input type="text" placeholder={t.name + ' (' + t.optional + ')'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <textarea placeholder={t.whatChanged + ' *'} required value={form.whatChanged} onChange={e => setForm({ ...form, whatChanged: e.target.value })} rows={4} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
            </>
          )}

          <div className="pt-4" style={{ borderTop: '2px solid var(--color-border)' }}>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>{language === 'es' ? 'Su informacion' : 'Your information'} ({t.optional})</p>
            <div className="space-y-3">
              <input type="text" placeholder={t.yourName} value={form.submitterName} onChange={e => setForm({ ...form, submitterName: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <input type="email" placeholder={t.yourEmail} value={form.submitterEmail} onChange={e => setForm({ ...form, submitterEmail: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
              <input type="text" placeholder={t.yourOrg} value={form.submitterOrg} onChange={e => setForm({ ...form, submitterOrg: e.target.value })} className={fieldClass} style={{ border: '2px solid var(--color-border)' }} />
            </div>
          </div>

          {status === 'error' && <p className="text-sm" style={{ color: 'var(--color-error)' }}>{t.error}</p>}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
            {status === 'submitting' ? t.submitting : t.submit}
          </button>
        </form>
      </main>
    </div>
  )
}
