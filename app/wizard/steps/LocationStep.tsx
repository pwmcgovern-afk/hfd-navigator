import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'
import { NEW_HAVEN_ZIPS } from '@/lib/constants'

export default function LocationStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  return (
    <section aria-labelledby="location-title">
      <h2 id="location-title" className="text-2xl font-semibold mb-2">{t.locationTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.locationSubtitle}</p>
      <label htmlFor="zip-input" className="sr-only">{t.locationTitle}</label>
      <input
        id="zip-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={5}
        placeholder="06511"
        value={data.zipCode}
        onChange={(e) => setData({ ...data, zipCode: e.target.value.replace(/\D/g, '') })}
        className="input text-3xl text-center font-semibold tracking-widest"
        aria-describedby={data.zipCode.length === 5 && !NEW_HAVEN_ZIPS.includes(data.zipCode) ? 'zip-warning' : undefined}
      />
      {data.zipCode.length === 5 && !NEW_HAVEN_ZIPS.includes(data.zipCode) && (
        <div id="zip-warning" className="info-card warning mt-4" role="alert">
          <p className="text-sm">{t.locationWarning}</p>
        </div>
      )}
    </section>
  )
}
