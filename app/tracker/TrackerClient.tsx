'use client'

import { useState } from 'react'
import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/components/LanguageContext'
import { useTracker } from '@/components/TrackerContext'
import { statusConfig, type TrackerStatus, type TrackerEntry } from '@/lib/trackerTypes'

const content = {
  en: {
    myTracker: 'My Tracker',
    trackerEmpty: 'No tracked resources yet',
    trackerEmptySubtitle: 'Use the Track button on any resource to start tracking your outreach',
    browseResources: 'Browse Resources',
    all: 'All',
    contactPerson: 'Contact',
    dateContacted: 'Contacted',
    notes: 'Notes',
    edit: 'Edit',
    delete: 'Delete',
    editTracking: 'Edit Tracking',
    status: 'Status',
    save: 'Save',
    cancel: 'Cancel',
    optional: 'Optional',
    backHome: 'Go back to home page',
    filterBy: 'Filter by status',
    editEntry: 'Edit tracking entry',
    deleteEntry: 'Delete tracking entry',
    closeModal: 'Close dialog',
    trackedResources: 'Your tracked resources',
  },
  es: {
    myTracker: 'Mi Seguimiento',
    trackerEmpty: 'No hay recursos rastreados',
    trackerEmptySubtitle: 'Use el botón Rastrear en cualquier recurso para comenzar',
    browseResources: 'Ver Recursos',
    all: 'Todos',
    contactPerson: 'Contacto',
    dateContacted: 'Contactado',
    notes: 'Notas',
    edit: 'Editar',
    delete: 'Eliminar',
    editTracking: 'Editar Seguimiento',
    status: 'Estado',
    save: 'Guardar',
    cancel: 'Cancelar',
    optional: 'Opcional',
    backHome: 'Volver a la página principal',
    filterBy: 'Filtrar por estado',
    editEntry: 'Editar entrada de seguimiento',
    deleteEntry: 'Eliminar entrada de seguimiento',
    closeModal: 'Cerrar diálogo',
    trackedResources: 'Tus recursos rastreados',
  }
}

export default function TrackerClient() {
  const { language } = useLanguage()
  const t = content[language]
  const { entries, updateEntry, deleteEntry } = useTracker()

  const [filterStatus, setFilterStatus] = useState<TrackerStatus | 'all'>('all')
  const [editingEntry, setEditingEntry] = useState<TrackerEntry | null>(null)

  // Edit form state
  const [formStatus, setFormStatus] = useState<TrackerStatus>('reached_out')
  const [formContact, setFormContact] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const filteredEntries = filterStatus === 'all'
    ? entries
    : entries.filter(e => e.status === filterStatus)

  const handleEdit = (entry: TrackerEntry) => {
    setEditingEntry(entry)
    setFormStatus(entry.status)
    setFormContact(entry.contactPerson)
    setFormDate(entry.dateContacted)
    setFormNotes(entry.notes)
  }

  const handleSave = () => {
    if (editingEntry) {
      updateEntry(editingEntry.id, {
        status: formStatus,
        contactPerson: formContact,
        dateContacted: formDate,
        notes: formNotes
      })
      setEditingEntry(null)
    }
  }

  const handleDelete = (id: string) => {
    deleteEntry(id)
  }

  const getResourceName = (entry: TrackerEntry) => {
    return language === 'es' && entry.resourceNameEs ? entry.resourceNameEs : entry.resourceName
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString(language === 'es' ? 'es-US' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 glass px-5 py-4" role="banner">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label={t.backHome}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold" style={{ color: 'var(--color-primary)' }}>{t.myTracker}</h1>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-6 fade-in" role="main" id="main-content">
        {/* Share list link */}
        {entries.length > 0 && (
          <div className="mb-4 print-hide">
            <a
              href={`/list?ids=${entries.map(e => e.resourceId).join(',')}&title=${encodeURIComponent(language === 'es' ? 'Mis Recursos' : 'My Resources')}`}
              className="text-sm font-medium inline-flex items-center gap-1.5"
              style={{ color: 'var(--color-primary)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {language === 'es' ? 'Compartir mi lista' : 'Share my list'}
            </a>
          </div>
        )}

        {entries.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16" role="status">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--color-bg)' }}>
              <svg className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">{t.trackerEmpty}</h2>
            <p className="mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{t.trackerEmptySubtitle}</p>
            <Link href="/resources" className="btn-primary inline-flex items-center gap-2">
              {t.browseResources}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <nav aria-label={t.filterBy}>
              <div className="flex gap-3 overflow-x-auto pb-6 -mx-5 px-5 scrollbar-hide" role="list">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`category-pill whitespace-nowrap ${filterStatus === 'all' ? 'active' : ''}`}
                  aria-pressed={filterStatus === 'all'}
                >
                  {t.all} ({entries.length})
                </button>
                {(Object.keys(statusConfig) as TrackerStatus[]).map((status) => {
                  const count = entries.filter(e => e.status === status).length
                  if (count === 0) return null
                  return (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`category-pill whitespace-nowrap ${filterStatus === status ? 'active' : ''}`}
                      aria-pressed={filterStatus === status}
                    >
                      {statusConfig[status][language]} ({count})
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Entries List */}
            <section aria-label={t.trackedResources}>
              <ul className="space-y-4 stagger-children" role="list">
              {filteredEntries.map((entry) => (
                <li key={entry.id}>
                  <article className="card-flat group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/resources/${entry.resourceId}`}
                          className="font-bold text-lg block truncate"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {getResourceName(entry)}
                        </Link>
                        {entry.organizationName && entry.organizationName !== entry.resourceName && (
                          <p className="text-sm truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{entry.organizationName}</p>
                        )}
                      </div>
                      <span className={`status-badge ${entry.status}`}>
                        {statusConfig[entry.status][language]}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      {entry.contactPerson && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium" style={{ color: 'var(--color-text)' }}>{entry.contactPerson}</span>
                        </div>
                      )}
                      {entry.dateContacted && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span style={{ color: 'var(--color-text)' }}>{formatDate(entry.dateContacted)}</span>
                        </div>
                      )}
                    </div>

                    {entry.notes && (
                      <p className="mt-4 text-sm line-clamp-2 rounded-xl p-3" style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>{entry.notes}</p>
                    )}

                    <div className="mt-4 pt-4 flex gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <button
                        onClick={() => handleEdit(entry)}
                        className="flex items-center gap-2 text-sm font-semibold btn-touch"
                        style={{ color: 'var(--color-primary)' }}
                        aria-label={`${t.editEntry}: ${getResourceName(entry)}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="flex items-center gap-2 text-sm font-semibold btn-touch"
                        style={{ color: 'var(--color-error)' }}
                        aria-label={`${t.deleteEntry}: ${getResourceName(entry)}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t.delete}
                      </button>
                    </div>
                  </article>
                </li>
              ))}
              </ul>
            </section>
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editingEntry && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setEditingEntry(null)}
            aria-label={t.closeModal}
          />
          <div
            className="relative w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto scale-in shadow-2xl"
            style={{ background: 'var(--color-surface)' }}
          >
            {/* Modal Handle */}
            <div className="w-12 h-1.5 rounded-full mx-auto mb-6 sm:hidden" style={{ background: 'var(--color-border)' }} aria-hidden="true" />

            <h2 id="modal-title" className="text-xl font-bold mb-6">{t.editTracking}</h2>

            {/* Status */}
            <fieldset className="mb-6">
              <legend className="text-sm font-semibold uppercase tracking-wider mb-3 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t.status}
              </legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t.status}>
                {(Object.keys(statusConfig) as TrackerStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFormStatus(status)}
                    className={`selection-btn text-center py-4 ${formStatus === status ? 'selected' : ''}`}
                    role="radio"
                    aria-checked={formStatus === status}
                  >
                    <span className="font-semibold text-sm">
                      {statusConfig[status][language]}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Contact Person */}
            <div className="mb-5">
              <label htmlFor="contact-person" className="text-sm font-semibold uppercase tracking-wider mb-3 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t.contactPerson} <span style={{ color: 'var(--color-text-muted)' }} className="normal-case">({t.optional})</span>
              </label>
              <input
                id="contact-person"
                type="text"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                className="input"
                placeholder="John Smith"
              />
            </div>

            {/* Date Contacted */}
            <div className="mb-5">
              <label htmlFor="date-contacted" className="text-sm font-semibold uppercase tracking-wider mb-3 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t.dateContacted}
              </label>
              <input
                id="date-contacted"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="input"
              />
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label htmlFor="notes" className="text-sm font-semibold uppercase tracking-wider mb-3 block" style={{ color: 'var(--color-text-secondary)' }}>
                {t.notes} <span style={{ color: 'var(--color-text-muted)' }} className="normal-case">({t.optional})</span>
              </label>
              <textarea
                id="notes"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={3}
                className="input resize-none min-h-24"
                placeholder="Next steps, notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setEditingEntry(null)}
                className="flex-1 btn-secondary"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
