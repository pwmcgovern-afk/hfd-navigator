import type { Language } from '@/lib/translations'

export interface WizardData {
  zipCode: string
  householdSize: number
  monthlyIncome: number
  housingStatus: string
  insuranceStatus: string
  populations: string[]
  categoriesNeeded: string[]
}

export interface StepProps {
  data: WizardData
  setData: (updater: WizardData | ((prev: WizardData) => WizardData)) => void
  language: Language
}
