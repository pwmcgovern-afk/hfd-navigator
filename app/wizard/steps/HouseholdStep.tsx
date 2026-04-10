import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function HouseholdStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  return (
    <section aria-labelledby="household-title">
      <h2 id="household-title" className="text-2xl font-semibold mb-2">{t.householdTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.householdSubtitle}</p>
      <div className="flex items-center justify-center gap-6" role="group" aria-label={t.householdTitle}>
        <button
          onClick={() => setData({ ...data, householdSize: Math.max(1, data.householdSize - 1) })}
          className="w-14 h-14 rounded-full text-2xl font-bold transition-colors"
          style={{ background: 'var(--color-border)' }}
          aria-label={t.decreaseHousehold}
        >
          −
        </button>
        <span
          className="text-6xl font-bold w-20 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {data.householdSize}
        </span>
        <button
          onClick={() => setData({ ...data, householdSize: data.householdSize + 1 })}
          className="w-14 h-14 rounded-full text-2xl font-bold transition-colors"
          style={{ background: 'var(--color-border)' }}
          aria-label={t.increaseHousehold}
        >
          +
        </button>
      </div>
    </section>
  )
}
