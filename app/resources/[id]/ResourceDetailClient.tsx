'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ShareButton from '@/components/ShareButton'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/components/LanguageContext'
import { useTracker } from '@/components/TrackerContext'
import type { TrackerStatus, TrackerOutcome } from '@/lib/trackerTypes'
import { getCategoryInfo } from '@/lib/categories'
import type { Resource } from '@/lib/types'
import TrackerModal from './TrackerModal'
import ResourceFeedback from '@/components/ResourceFeedback'
import FreshnessBadge from '@/components/FreshnessBadge'

const ResourceMap = dynamic(() => import('@/components/ResourceMap'), { ssr: false })

interface Props {
  resource: Resource
}

const content = {
  en: {
    about: 'About',
    howToGetHelp: 'How to Get Help',
    whoCanGetHelp: 'Who Can Get Help',
    tipsTitle: 'Tips for This Resource',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    website: 'Website',
    call: 'Call',
    directions: 'Directions',
    lastVerified: 'Last verified',
    notVerified: 'Not yet verified',
    serves: 'Serves:',
    incomeLimit: 'Income limit:',
    ofFPL: '% of Federal Poverty Level',
    homeless: 'Currently homeless',
    at_risk: 'At risk of homelessness',
    housed: 'Currently housed',
    veteran: 'Veterans',
    formerly_incarcerated: 'Formerly incarcerated',
    pregnant: 'Pregnant individuals',
    children: 'Families with children',
    seniors: 'Seniors (60+)',
    disabled: 'People with disabilities',
    domestic_violence: 'DV survivors',
    track: 'Track',
    tracked: 'Tracked',
    editTracking: 'Edit Tracking',
    contactPerson: 'Contact Person',
    dateContacted: 'Date Contacted',
    status: 'Status',
    notes: 'Notes / Next Steps',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    optional: 'Optional',
    reportIssue: 'Report an issue',
    reportIssueSubject: 'Issue with resource:',
    backToResources: 'Back to all resources',
    callPhone: 'Call phone number',
    getDirections: 'Get directions to location',
    closeDialog: 'Close dialog',
  },
  es: {
    about: 'Acerca de',
    howToGetHelp: 'Cómo Obtener Ayuda',
    whoCanGetHelp: 'Quién Puede Obtener Ayuda',
    tipsTitle: 'Consejos para Este Recurso',
    location: 'Ubicación',
    phone: 'Teléfono',
    email: 'Correo',
    hours: 'Horario',
    website: 'Sitio Web',
    call: 'Llamar',
    directions: 'Direcciones',
    lastVerified: 'Última verificación',
    notVerified: 'Aún no verificado',
    serves: 'Sirve a:',
    incomeLimit: 'Límite de ingresos:',
    ofFPL: '% del Nivel Federal de Pobreza',
    homeless: 'Actualmente sin hogar',
    at_risk: 'En riesgo de perder vivienda',
    housed: 'Con vivienda actualmente',
    veteran: 'Veteranos',
    formerly_incarcerated: 'Anteriormente encarcelados',
    pregnant: 'Personas embarazadas',
    children: 'Familias con niños',
    seniors: 'Personas mayores (60+)',
    disabled: 'Personas con discapacidades',
    domestic_violence: 'Sobrevivientes de VD',
    track: 'Rastrear',
    tracked: 'Rastreado',
    editTracking: 'Editar Seguimiento',
    contactPerson: 'Persona de Contacto',
    dateContacted: 'Fecha de Contacto',
    status: 'Estado',
    notes: 'Notas / Próximos Pasos',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    optional: 'Opcional',
    reportIssue: 'Reportar un problema',
    reportIssueSubject: 'Problema con recurso:',
    backToResources: 'Volver a todos los recursos',
    callPhone: 'Llamar al número de teléfono',
    getDirections: 'Obtener direcciones a la ubicación',
    closeDialog: 'Cerrar diálogo',
  }
}

export default function ResourceDetailClient({ resource }: Props) {
  const { language } = useLanguage()
  const t = content[language]
  const { getEntryByResourceId, addEntry, updateEntry, deleteEntry } = useTracker()

  const [showTrackModal, setShowTrackModal] = useState(false)
  const existingEntry = getEntryByResourceId(resource.id)

  const getCatInfo = (slug: string) => getCategoryInfo(slug, language)

  const tips = language === 'es' && resource.tipsEs?.length > 0
    ? resource.tipsEs
    : resource.tips?.length > 0
      ? resource.tips
      : []

  const name = language === 'es' && resource.nameEs ? resource.nameEs : resource.name
  const description = language === 'es' && resource.descriptionEs ? resource.descriptionEs : resource.description
  const howToApply = language === 'es' && resource.howToApplyEs ? resource.howToApplyEs : resource.howToApply

  const googleMapsUrl = resource.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${resource.address}, ${resource.city}, ${resource.state} ${resource.zip || ''}`
      )}`
    : null

  const eligibility = resource.eligibility
  const translateHousing = (s: string) => t[s as keyof typeof t] || s
  const translatePopulation = (p: string) => t[p as keyof typeof t] || p

  const handleSave = (formData: { status: TrackerStatus; outcome: TrackerOutcome; contactPerson: string; dateContacted: string; notes: string }) => {
    if (existingEntry) {
      updateEntry(existingEntry.id, formData)
    } else {
      addEntry({
        resourceId: resource.id,
        resourceName: resource.name,
        resourceNameEs: resource.nameEs || undefined,
        organizationName: resource.organization || undefined,
        ...formData
      })
    }
    setShowTrackModal(false)
  }

  const handleDelete = () => {
    if (existingEntry) {
      deleteEntry(existingEntry.id)
      setShowTrackModal(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 px-5 py-4" style={{ background: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }} role="banner">
        <div className="flex items-center justify-between">
          <Link
            href="/resources"
            className="p-2 -ml-2 rounded-lg"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label={t.backToResources}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-5 py-6 fade-in" role="main" id="main-content">
        {/* Categories */}
        <nav aria-label={language === 'en' ? 'Resource categories' : 'Categorías del recurso'}>
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.categories.map((cat) => {
              const catInfo = getCatInfo(cat)
              return (
                <Link key={cat} href={`/category/${cat}`} className="category-pill">
                  <span aria-hidden="true">{catInfo?.icon}</span> {catInfo?.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Name & Organization */}
        <h1 className="text-2xl font-semibold mb-1">{name}</h1>
        {resource.organization && resource.organization !== resource.name && (
          <p style={{ color: 'var(--color-text-secondary)' }}>{resource.organization}</p>
        )}

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {resource.acceptingClients === false ? (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>
              {language === 'es' ? 'No acepta clientes' : 'Not accepting clients'}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              {language === 'es' ? 'Aceptando clientes' : 'Accepting clients'}
            </span>
          )}
          {resource.cost && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              {resource.cost === 'Free' ? (language === 'es' ? 'Gratis' : 'Free') : resource.cost}
            </span>
          )}
          {resource.referralRequired && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>
              {language === 'es' ? 'Requiere referencia' : 'Referral required'}
            </span>
          )}
          {resource.waitTime && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {language === 'es' ? 'Espera: ' : 'Wait: '}{resource.waitTime}
            </span>
          )}
        </div>

        {/* Languages & Insurance */}
        {(resource.languages?.length > 0 || resource.insuranceAccepted?.length > 0) && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {resource.languages?.length > 0 && (
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Idiomas: ' : 'Languages: '}</span>
                <span>{resource.languages.join(', ')}</span>
              </div>
            )}
            {resource.insuranceAccepted?.length > 0 && (
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Seguro: ' : 'Insurance: '}</span>
                <span>{resource.insuranceAccepted.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* About */}
        <div className="card-flat mt-6">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{t.about}</h2>
          <p className="text-[var(--color-text)] leading-relaxed">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6" role="group" aria-label={language === 'en' ? 'Quick actions' : 'Acciones rápidas'}>
          {resource.phone && (
            <a
              href={`tel:${resource.phone.replace(/\D/g, '')}`}
              className="btn-primary text-center flex items-center justify-center gap-2"
              aria-label={`${t.callPhone}: ${resource.phone}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t.call}
            </a>
          )}
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-center flex items-center justify-center gap-2"
              aria-label={t.getDirections}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.directions}
            </a>
          )}
        </div>

        {/* Details */}
        <div className="mt-8 space-y-5">
          {resource.address && (
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t.location}</h2>
              <p className="text-[var(--color-text)]">
                {resource.address}<br />
                {resource.city}, {resource.state} {resource.zip}
              </p>
            </div>
          )}

          {resource.latitude && resource.longitude && (
            <ResourceMap latitude={resource.latitude} longitude={resource.longitude} name={name} />
          )}

          <div className="grid grid-cols-2 gap-5">
            {resource.phone && (
              <div>
                <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t.phone}</h2>
                <a href={`tel:${resource.phone.replace(/\D/g, '')}`} className="text-[var(--color-primary)] font-medium">
                  {resource.phone}
                </a>
              </div>
            )}
            {resource.email && (
              <div>
                <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t.email}</h2>
                <a href={`mailto:${resource.email}`} className="text-[var(--color-primary)] font-medium break-all text-sm">
                  {resource.email}
                </a>
              </div>
            )}
          </div>

          {resource.hours && (
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t.hours}</h2>
              <p className="text-[var(--color-text)] whitespace-pre-line">{resource.hours}</p>
            </div>
          )}

          {resource.website && (
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{t.website}</h2>
              <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-medium break-all">
                {resource.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {/* How to Apply */}
          {howToApply && (
            <div className="info-card success">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.howToGetHelp}
              </h2>
              <p className="whitespace-pre-line">{howToApply}</p>
            </div>
          )}

          {/* Eligibility */}
          {eligibility && Object.keys(eligibility).length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{t.whoCanGetHelp}</h2>
              <ul className="text-[var(--color-text)] space-y-1 text-sm">
                {Array.isArray(eligibility.housingStatus) && eligibility.housingStatus.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    <span>{eligibility.housingStatus.map((s: string) => translateHousing(s)).join(', ')}</span>
                  </li>
                )}
                {Array.isArray(eligibility.populations) && eligibility.populations.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    <span>{t.serves} {eligibility.populations.map((p: string) => translatePopulation(p)).join(', ')}</span>
                  </li>
                )}
                {typeof eligibility.incomeLimitPctFpl === 'number' && (
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    <span>{t.incomeLimit} {eligibility.incomeLimitPctFpl}{t.ofFPL}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="info-card info mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.tipsTitle}
            </h2>
            <ul className="space-y-2 text-sm">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share & Track */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex gap-3">
          <ShareButton title={name} text={description} phone={resource.phone} />
          <button
            onClick={() => setShowTrackModal(true)}
            className={`btn-secondary flex-1 flex items-center justify-center gap-2 ${existingEntry ? 'bg-[var(--color-success-light)] border-[var(--color-success)]' : ''}`}
          >
            {existingEntry ? (
              <>
                <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-success)]">{t.tracked}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t.track}
              </>
            )}
          </button>
        </div>

        {/* Tracker Modal */}
        <TrackerModal
          isOpen={showTrackModal}
          onClose={() => setShowTrackModal(false)}
          onSave={handleSave}
          onDelete={existingEntry ? handleDelete : undefined}
          existingData={existingEntry ? {
            status: existingEntry.status,
            outcome: (existingEntry.outcome || '') as TrackerOutcome,
            contactPerson: existingEntry.contactPerson,
            dateContacted: existingEntry.dateContacted,
            notes: existingEntry.notes,
          } : undefined}
          language={language}
          translations={{
            track: t.track,
            editTracking: t.editTracking,
            contactPerson: t.contactPerson,
            dateContacted: t.dateContacted,
            status: t.status,
            notes: t.notes,
            save: t.save,
            cancel: t.cancel,
            delete: t.delete,
            optional: t.optional,
            closeDialog: t.closeDialog,
          }}
        />

        {/* Feedback */}
        <ResourceFeedback resourceId={resource.id} />

        {/* Verification & Report */}
        <div className="mt-4 flex items-center justify-between">
          <FreshnessBadge verifiedAt={resource.verifiedAt} verificationMethod={resource.verificationMethod} />
          <a
            href={`mailto:pwmcgovern@gmail.com?subject=${encodeURIComponent(`${t.reportIssueSubject} ${resource.name}`)}&body=${encodeURIComponent(`Resource: ${resource.name}\nID: ${resource.id}\n\nIssue:\n`)}`}
            className="text-xs font-medium flex items-center gap-1 btn-touch"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.reportIssue}
          </a>
        </div>
      </main>
    </div>
  )
}
