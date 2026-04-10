'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import type { WizardData } from './wizard-types'
import { wizardContent } from './wizard-content'
import LocationStep from './steps/LocationStep'
import HouseholdStep from './steps/HouseholdStep'
import IncomeStep from './steps/IncomeStep'
import HousingStep from './steps/HousingStep'
import InsuranceStep from './steps/InsuranceStep'
import SituationsStep from './steps/SituationsStep'
import NeedsStep from './steps/NeedsStep'

const STEPS = ['location', 'household', 'income', 'housing', 'insurance', 'situations', 'needs'] as const
type Step = typeof STEPS[number]

const STEP_COMPONENTS = {
  location: LocationStep,
  household: HouseholdStep,
  income: IncomeStep,
  housing: HousingStep,
  insurance: InsuranceStep,
  situations: SituationsStep,
  needs: NeedsStep,
} as const

export default function WizardPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = wizardContent[language]

  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('wizardStep')
      if (saved && STEPS.includes(saved as Step)) return saved as Step
    }
    return 'location'
  })
  const [data, setData] = useState<WizardData>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('wizardData')
      if (saved) try { return JSON.parse(saved) } catch {}
    }
    return {
      zipCode: '',
      householdSize: 1,
      monthlyIncome: 0,
      housingStatus: '',
      insuranceStatus: '',
      populations: [],
      categoriesNeeded: []
    }
  })

  useEffect(() => {
    sessionStorage.setItem('wizardData', JSON.stringify(data))
    sessionStorage.setItem('wizardStep', currentStep)
  }, [data, currentStep])

  const stepIndex = STEPS.indexOf(currentStep)
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const goNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex])
    } else {
      const params = new URLSearchParams()
      params.set('zip', data.zipCode)
      params.set('household', data.householdSize.toString())
      params.set('income', data.monthlyIncome.toString())
      params.set('housing', data.housingStatus)
      params.set('insurance', data.insuranceStatus)
      if (data.populations.length) params.set('populations', data.populations.join(','))
      if (data.categoriesNeeded.length) params.set('categories', data.categoriesNeeded.join(','))
      router.push(`/results?${params.toString()}`)
    }
  }

  const goBack = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex])
    } else {
      router.push('/')
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'location': return data.zipCode.length === 5
      case 'household': return data.householdSize >= 1
      case 'income': return true
      case 'housing': return data.housingStatus !== ''
      case 'insurance': return data.insuranceStatus !== ''
      case 'situations': return true
      case 'needs': return data.categoriesNeeded.length > 0
      default: return false
    }
  }

  const StepComponent = STEP_COMPONENTS[currentStep]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-label={t.progressLabel}
      >
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="sr-only" aria-live="polite">
        {t.step} {stepIndex + 1} {t.of} {STEPS.length}
      </div>

      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '2px solid var(--color-border)' }} role="banner">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-lg"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label={t.goBack}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {t.step} {stepIndex + 1} {t.of} {STEPS.length}
        </span>
        <LanguageToggle />
      </header>

      {/* Step Content */}
      <main className="flex-1 px-5 py-8 fade-in" role="main" id="main-content">
        <StepComponent data={data} setData={setData} language={language} />
      </main>

      {/* Footer */}
      <footer className="px-5 py-4" style={{ borderTop: '2px solid var(--color-border)', background: 'var(--color-surface)' }} role="contentinfo">
        <button
          onClick={goNext}
          disabled={!canProceed()}
          className="btn-primary w-full"
          aria-disabled={!canProceed()}
        >
          {stepIndex === STEPS.length - 1 ? t.seeResults : t.continue}
        </button>
        {currentStep === 'situations' && (
          <button
            onClick={goNext}
            className="w-full mt-3 py-3 text-sm font-medium btn-touch justify-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {t.skip}
          </button>
        )}
      </footer>
    </div>
  )
}
