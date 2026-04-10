import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function NeedsStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  const toggleCategory = (slug: string) => {
    setData(prev => ({
      ...prev,
      categoriesNeeded: prev.categoriesNeeded.includes(slug)
        ? prev.categoriesNeeded.filter(v => v !== slug)
        : [...prev.categoriesNeeded, slug]
    }))
  }

  return (
    <section aria-labelledby="needs-title">
      <h2 id="needs-title" className="text-2xl font-semibold mb-2">{t.needsTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.needsSubtitle}</p>
      <fieldset>
        <legend className="sr-only">{t.needsTitle}</legend>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label={t.needsTitle}>
          {t.needsOptions.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`selection-btn text-center ${data.categoriesNeeded.includes(cat.slug) ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={data.categoriesNeeded.includes(cat.slug)}
            >
              <div className="text-2xl mb-1" aria-hidden="true">{cat.icon}</div>
              <div className="font-medium text-sm">{cat.name}</div>
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
