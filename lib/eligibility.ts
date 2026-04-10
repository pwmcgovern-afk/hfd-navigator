import { calculatePctFPL } from './constants'
import type { EligibilityCriteria } from './types'

export type { EligibilityCriteria }

export interface UserProfile {
  zipCode: string
  householdSize: number
  monthlyIncome: number
  housingStatus: string
  insuranceStatus: string
  populations: string[]
  categoriesNeeded: string[]
}

export interface ResourceWithEligibility {
  id: string
  name: string
  organization?: string | null
  description: string
  categories: string[]
  address?: string | null
  city: string
  phone?: string | null
  website?: string | null
  eligibility?: EligibilityCriteria | null
  howToApply?: string | null
}

export interface MatchReason {
  type: 'match' | 'warning' | 'disqualify'
  message: string
}

/**
 * Calculate eligibility score with hard/soft rules and match reasons.
 * Hard rules (disqualify): referral required, wrong housing status for homeless-only services,
 *   income way over limit (>50% over).
 * Soft rules (reduce score): income slightly over, category mismatch, no population match.
 * Bonus: matching populations, category match, insurance match.
 */
export function calculateEligibilityScore(
  user: UserProfile,
  resource: ResourceWithEligibility
): { score: number; reasons: MatchReason[] } {
  const eligibility = resource.eligibility as EligibilityCriteria | null
  const reasons: MatchReason[] = []

  // If no eligibility criteria, assume everyone qualifies
  if (!eligibility) {
    if (resource.categories.some(c => user.categoriesNeeded.includes(c))) {
      reasons.push({ type: 'match', message: 'Category match' })
    }
    return { score: 100, reasons }
  }

  let score = 100
  let disqualified = false

  // HARD RULE: Income limit
  if (eligibility.incomeLimitPctFpl) {
    const annualIncome = user.monthlyIncome * 12
    const userPctFpl = calculatePctFPL(annualIncome, user.householdSize)

    if (userPctFpl <= eligibility.incomeLimitPctFpl) {
      reasons.push({ type: 'match', message: `Income within ${eligibility.incomeLimitPctFpl}% FPL limit` })
    } else {
      const overBy = userPctFpl - eligibility.incomeLimitPctFpl
      if (overBy > 50) {
        disqualified = true
        reasons.push({ type: 'disqualify', message: `Income exceeds ${eligibility.incomeLimitPctFpl}% FPL limit` })
      } else {
        score -= overBy
        reasons.push({ type: 'warning', message: `Income slightly over limit (${overBy}% over)` })
      }
    }
  }

  // HARD RULE: Housing status
  if (eligibility.housingStatus && eligibility.housingStatus.length > 0) {
    if (eligibility.housingStatus.includes(user.housingStatus)) {
      reasons.push({ type: 'match', message: 'Housing status matches' })
    } else {
      // If resource only serves homeless and user is housed — hard disqualify
      if (eligibility.housingStatus.length === 1 && eligibility.housingStatus[0] === 'homeless') {
        disqualified = true
        reasons.push({ type: 'disqualify', message: 'Only serves currently homeless individuals' })
      } else {
        score -= 20
        reasons.push({ type: 'warning', message: 'Housing status may not match' })
      }
    }
  }

  // SOFT RULE: Population match — bonus for matching, no penalty for not
  if (eligibility.populations && eligibility.populations.length > 0) {
    const matchingPops = eligibility.populations.filter(p => user.populations.includes(p))
    if (matchingPops.length > 0) {
      score += 15
      reasons.push({ type: 'match', message: `Serves: ${matchingPops.join(', ')}` })
    }
  }

  // Category match — strong signal
  const categoryMatch = resource.categories.some(c => user.categoriesNeeded.includes(c))
  if (categoryMatch) {
    score += 10
    reasons.push({ type: 'match', message: 'Category matches your needs' })
  } else if (user.categoriesNeeded.length > 0) {
    score -= 25
    reasons.push({ type: 'warning', message: 'Not in your selected categories' })
  }

  // Insurance match (if we have data)
  if (eligibility.insuranceRequired === true && user.insuranceStatus === 'uninsured') {
    score -= 15
    reasons.push({ type: 'warning', message: 'May require insurance' })
  }

  if (disqualified) {
    return { score: 0, reasons }
  }

  return { score: Math.max(0, Math.min(115, score)), reasons }
}

/**
 * Filter and rank resources for a user, including match reasons
 */
export function filterAndRankResources(
  user: UserProfile,
  resources: ResourceWithEligibility[]
): Array<ResourceWithEligibility & { score: number; matchReasons: MatchReason[] }> {
  return resources
    .map(resource => {
      const { score, reasons } = calculateEligibilityScore(user, resource)
      return { ...resource, score, matchReasons: reasons }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
}
