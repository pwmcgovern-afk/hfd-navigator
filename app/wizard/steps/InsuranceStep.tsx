import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function InsuranceStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  return (
    <section aria-labelledby="insurance-title">
      <h2 id="insurance-title" className="text-2xl font-semibold mb-2">{t.insuranceTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.insuranceSubtitle}</p>
      <fieldset>
        <legend className="sr-only">{t.insuranceTitle}</legend>
        <div className="space-y-3" role="radiogroup" aria-label={t.insuranceTitle}>
          {t.insuranceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setData({ ...data, insuranceStatus: option.value })}
              className={`selection-btn ${data.insuranceStatus === option.value ? 'selected' : ''}`}
              role="radio"
              aria-checked={data.insuranceStatus === option.value}
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
