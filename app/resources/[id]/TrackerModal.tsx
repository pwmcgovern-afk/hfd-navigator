import { useState, useEffect, useRef } from 'react'
import { statusConfig, outcomeConfig, type TrackerStatus, type TrackerOutcome } from '@/lib/trackerTypes'
import type { Language } from '@/lib/translations'

interface TrackerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    status: TrackerStatus
    outcome: TrackerOutcome
    contactPerson: string
    dateContacted: string
    notes: string
  }) => void
  onDelete?: () => void
  existingData?: {
    status: TrackerStatus
    outcome: TrackerOutcome
    contactPerson: string
    dateContacted: string
    notes: string
  }
  language: Language
  translations: {
    track: string
    editTracking: string
    contactPerson: string
    dateContacted: string
    status: string
    notes: string
    save: string
    cancel: string
    delete: string
    optional: string
    closeDialog: string
  }
}

export default function TrackerModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  existingData,
  language,
  translations: t,
}: TrackerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [formStatus, setFormStatus] = useState<TrackerStatus>(existingData?.status || 'reached_out')
  const [formOutcome, setFormOutcome] = useState<TrackerOutcome>(existingData?.outcome || '')
  const [formContact, setFormContact] = useState(existingData?.contactPerson || '')
  const [formDate, setFormDate] = useState(existingData?.dateContacted || new Date().toISOString().split('T')[0])
  const [formNotes, setFormNotes] = useState(existingData?.notes || '')

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormStatus(existingData?.status || 'reached_out')
      setFormOutcome(existingData?.outcome || '')
      setFormContact(existingData?.contactPerson || '')
      setFormDate(existingData?.dateContacted || new Date().toISOString().split('T')[0])
      setFormNotes(existingData?.notes || '')
    }
  }, [isOpen, existingData])

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const firstInput = modalRef.current?.querySelector<HTMLElement>('button, input')
    firstInput?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-modal-title"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
        aria-label={t.closeDialog}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)' }}
      >
        <h2 id="track-modal-title" className="text-lg font-semibold mb-4">
          {existingData ? t.editTracking : t.track}
        </h2>

        {/* Status */}
        <fieldset className="mb-4">
          <legend className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t.status}
          </legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.status}>
            {(Object.keys(statusConfig) as TrackerStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFormStatus(status)}
                className={`selection-btn text-center py-3 ${formStatus === status ? 'selected' : ''}`}
                role="radio"
                aria-checked={formStatus === status}
              >
                <span className="font-medium text-sm">
                  {statusConfig[status][language]}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Outcome */}
        <fieldset className="mb-4">
          <legend className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {language === 'es' ? 'Resultado' : 'Outcome'} <span style={{ color: 'var(--color-text-muted)' }}>({t.optional})</span>
          </legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={language === 'es' ? 'Resultado' : 'Outcome'}>
            {(Object.keys(outcomeConfig) as TrackerOutcome[]).filter(o => o !== '').map((outcome) => (
              <button
                key={outcome}
                onClick={() => setFormOutcome(formOutcome === outcome ? '' : outcome)}
                className={`selection-btn text-center py-2 ${formOutcome === outcome ? 'selected' : ''}`}
                role="radio"
                aria-checked={formOutcome === outcome}
              >
                <span className="font-medium text-xs">
                  {outcomeConfig[outcome][language]}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Contact Person */}
        <div className="mb-4">
          <label htmlFor="contact-person-input" className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t.contactPerson} <span style={{ color: 'var(--color-text-muted)' }}>({t.optional})</span>
          </label>
          <input
            id="contact-person-input"
            type="text"
            value={formContact}
            onChange={(e) => setFormContact(e.target.value)}
            placeholder="John Smith"
            className="input"
          />
        </div>

        {/* Date Contacted */}
        <div className="mb-4">
          <label htmlFor="date-contacted-input" className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t.dateContacted}
          </label>
          <input
            id="date-contacted-input"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            className="input"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes-input" className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
            {t.notes} <span style={{ color: 'var(--color-text-muted)' }}>({t.optional})</span>
          </label>
          <textarea
            id="notes-input"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder="Next steps, notes..."
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-3 font-medium rounded-xl transition-colors btn-touch"
              style={{ color: 'var(--color-error)' }}
            >
              {t.delete}
            </button>
          )}
          <button onClick={onClose} className="flex-1 btn-secondary">
            {t.cancel}
          </button>
          <button
            onClick={() => onSave({ status: formStatus, outcome: formOutcome, contactPerson: formContact, dateContacted: formDate, notes: formNotes })}
            className="flex-1 btn-primary"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  )
}
