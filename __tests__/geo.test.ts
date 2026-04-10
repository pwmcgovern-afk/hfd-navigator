/**
 * Tests for geo distance calculations.
 * Run: npx tsx --test __tests__/geo.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getDistanceMiles } from '../lib/geo'

describe('getDistanceMiles', () => {
  it('returns 0 for the same point', () => {
    const dist = getDistanceMiles(41.3083, -72.9279, 41.3083, -72.9279)
    assert.equal(dist, 0)
  })

  it('calculates distance between Hartford and Hartford', () => {
    // Hartford Green to Hartford (~37 miles)
    const dist = getDistanceMiles(41.3083, -72.9279, 41.7658, -72.6734)
    assert.ok(dist > 30, 'should be more than 30 miles')
    assert.ok(dist < 45, 'should be less than 45 miles')
  })

  it('calculates short distance correctly', () => {
    // Two points ~1 mile apart in Hartford
    const dist = getDistanceMiles(41.3083, -72.9279, 41.3200, -72.9279)
    assert.ok(dist > 0.5, 'should be more than 0.5 miles')
    assert.ok(dist < 2, 'should be less than 2 miles')
  })
})
