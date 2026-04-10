import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function SituationsStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  const togglePopulation = (value: string) => {
    setData(prev => ({
      ...prev,
      populations: prev.populations.includes(value)
        ? prev.populations.filter(v => v !== value)
        : [...prev.populations, value]
    }))
  }

  return (
    <section aria-labelledby="situations-title">
      <h2 id="situations-title" className="text-2xl font-semibold mb-2">{t.situationsTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.situationsSubtitle}</p>
      <fieldset>
        <legend className="sr-only">{t.situationsTitle}</legend>
        <div className="space-y-3" role="group" aria-label={t.situationsTitle}>
          {t.situationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => togglePopulation(option.value)}
              className={`selection-btn ${data.populations.includes(option.value) ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={data.populations.includes(option.value)}
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
