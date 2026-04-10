// 2026 Federal Poverty Level guidelines (annual income)
// Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
export const FPL_2026 = {
  1: 15960,
  2: 21640,
  3: 27320,
  4: 33000,
  5: 38680,
  6: 44360,
  7: 50040,
  8: 55720,
  // Add $5,680 for each additional person
  additionalPerson: 5680,
}

export function getFPL(householdSize: number): number {
  if (householdSize <= 8) {
    return FPL_2026[householdSize as keyof typeof FPL_2026] as number
  }
  return FPL_2026[8] + (householdSize - 8) * FPL_2026.additionalPerson
}

export function calculatePctFPL(annualIncome: number, householdSize: number): number {
  const fpl = getFPL(householdSize)
  return Math.round((annualIncome / fpl) * 100)
}

// Categories
export const CATEGORIES = [
  { slug: 'housing', name: 'Housing', icon: '🏠' },
  { slug: 'food', name: 'Food', icon: '🍎' },
  { slug: 'cash', name: 'Cash Assistance', icon: '💵' },
  { slug: 'harm-reduction', name: 'Harm Reduction', icon: '💊' },
  { slug: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { slug: 'mental-health', name: 'Mental Health', icon: '🧠' },
  { slug: 'employment', name: 'Employment', icon: '💼' },
  { slug: 'childcare', name: 'Childcare', icon: '👶' },
  { slug: 'legal', name: 'Legal Aid', icon: '⚖️' },
  { slug: 'transportation', name: 'Transportation', icon: '🚌' },
  { slug: 'utilities', name: 'Utilities', icon: '💡' },
  { slug: 'immigration', name: 'Immigration', icon: '📄' },
] as const

export type CategorySlug = typeof CATEGORIES[number]['slug']

// Housing statuses for wizard
export const HOUSING_STATUSES = [
  { value: 'homeless', label: 'Currently homeless or in shelter' },
  { value: 'at_risk', label: 'At risk of losing housing' },
  { value: 'housed', label: 'Stably housed' },
] as const

// Insurance statuses
export const INSURANCE_STATUSES = [
  { value: 'uninsured', label: 'No insurance' },
  { value: 'medicaid', label: 'Medicaid / HUSKY' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'private', label: 'Private insurance' },
] as const

// Special populations
export const SPECIAL_POPULATIONS = [
  { value: 'formerly_incarcerated', label: 'Recently released from incarceration' },
  { value: 'veteran', label: 'Veteran' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'children', label: 'Have children under 18' },
  { value: 'disability', label: 'Have a disability' },
  { value: 'domestic_violence', label: 'Fleeing domestic violence' },
  { value: 'substance_use', label: 'Substance use recovery' },
] as const

// Hartford area zip codes
export const HARTFORD_ZIPS = [
  '06101', '06102', '06103', '06104', '06105', '06106', '06112', '06114', '06120'
]
