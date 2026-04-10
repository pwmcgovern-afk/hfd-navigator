/**
 * Tests for eligibility scoring logic.
 * Run: npx tsx --test __tests__/eligibility.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateEligibilityScore, filterAndRankResources, type UserProfile, type ResourceWithEligibility } from '../lib/eligibility'

const baseUser: UserProfile = {
  zipCode: '06511',
  householdSize: 2,
  monthlyIncome: 1500,
  housingStatus: 'housed',
  insuranceStatus: 'uninsured',
  populations: [],
  categoriesNeeded: ['food', 'healthcare'],
}

const baseResource: ResourceWithEligibility = {
  id: '1',
  name: 'Test Resource',
  description: 'A test',
  categories: ['food'],
  city: 'Hartford',
}

describe('calculateEligibilityScore', () => {
  it('returns 100 for resource with no eligibility criteria', () => {
    const { score } = calculateEligibilityScore(baseUser, baseResource)
    assert.equal(score, 100)
  })

  it('returns 0 when income is way over limit', () => {
    const resource: ResourceWithEligibility = {
      ...baseResource,
      eligibility: { incomeLimitPctFpl: 50 },
    }
    const user = { ...baseUser, monthlyIncome: 5000 }
    const { score } = calculateEligibilityScore(user, resource)
    assert.equal(score, 0)
  })

  it('gives bonus for matching populations', () => {
    const resource: ResourceWithEligibility = {
      ...baseResource,
      eligibility: { populations: ['veteran'] },
    }
    const veteranUser = { ...baseUser, populations: ['veteran'] }
    const nonVeteranUser = { ...baseUser, populations: [] }

    const { score: veteranScore } = calculateEligibilityScore(veteranUser, resource)
    const { score: nonVeteranScore } = calculateEligibilityScore(nonVeteranUser, resource)

    assert.ok(veteranScore > nonVeteranScore, 'veteran should score higher')
  })

  it('penalizes category mismatch', () => {
    const resource: ResourceWithEligibility = {
      ...baseResource,
      categories: ['legal'],
    }
    const user = { ...baseUser, categoriesNeeded: ['food'] }
    const { score } = calculateEligibilityScore(user, resource)
    assert.ok(score < 100, 'category mismatch should reduce score')
  })
})

describe('filterAndRankResources', () => {
  it('filters out zero-score resources', () => {
    const resources: ResourceWithEligibility[] = [
      { ...baseResource, id: '1', categories: ['food'] },
      {
        ...baseResource,
        id: '2',
        categories: ['food'],
        eligibility: { incomeLimitPctFpl: 10 }, // Very low limit
      },
    ]
    const user = { ...baseUser, monthlyIncome: 3000 }
    const ranked = filterAndRankResources(user, resources)

    // Resource 2 should be filtered out (income way over 10% FPL)
    assert.ok(ranked.length <= 2)
    assert.ok(ranked.every(r => r.score > 0))
  })

  it('sorts by score descending', () => {
    const resources: ResourceWithEligibility[] = [
      { ...baseResource, id: '1', categories: ['legal'] },
      { ...baseResource, id: '2', categories: ['food'] },
    ]
    const ranked = filterAndRankResources(baseUser, resources)

    if (ranked.length >= 2) {
      assert.ok(ranked[0].score >= ranked[1].score, 'should be sorted by score desc')
    }
  })
})
