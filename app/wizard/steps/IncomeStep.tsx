import type { StepProps } from '../wizard-types'
import { wizardContent } from '../wizard-content'

export default function IncomeStep({ data, setData, language }: StepProps) {
  const t = wizardContent[language]

  return (
    <section aria-labelledby="income-title">
      <h2 id="income-title" className="text-2xl font-semibold mb-2">{t.incomeTitle}</h2>
      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>{t.incomeSubtitle}</p>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-semibold" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true">$</span>
        <label htmlFor="income-input" className="sr-only">{t.incomeTitle}</label>
        <input
          id="income-input"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={data.monthlyIncome || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '')
            setData({ ...data, monthlyIncome: parseInt(val) || 0 })
          }}
          className="input text-3xl pl-12 font-semibold"
          aria-describedby="income-yearly"
        />
      </div>
      <p id="income-yearly" className="mt-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
        ${(data.monthlyIncome * 12).toLocaleString()}{t.perYear}
      </p>
    </section>
  )
}
