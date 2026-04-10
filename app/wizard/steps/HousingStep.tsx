import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function HousingStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  return (
    <section aria-labelledby="housing-title">
      <h2 id="housing-title" className="text-2xl font-semibold mb-2">{t.housingTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.housingSubtitle}</p>
      <fieldset>
        <legend className="sr-only">{t.housingTitle}</legend>
        <div className="space-y-3" role="radiogroup" aria-label={t.housingTitle}>
          {t.housingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setData({ ...data, housingStatus: option.value })}
              className={`selection-btn ${data.housingStatus === option.value ? 'selected' : ''}`}
              role="radio"
              aria-checked={data.housingStatus === option.value}
            >
              <span className="flex items-center justify-between">
                <span className="font-medium">{option.label}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
