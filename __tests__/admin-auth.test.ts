/**
 * Tests for admin authentication helpers.
 * Run: npx tsx --test __tests__/admin-auth.test.ts
 */
import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'

// Set test API key before importing module
process.env.ADMIN_API_KEY = 'test-secret-key-12345'

// Use require to avoid top-level await
const { createSessionToken, verifySessionToken, verifyApiKey } = require('../lib/admin-auth') as typeof import('../lib/admin-auth')

describe('admin-auth', () => {
  describe('createSessionToken', () => {
    it('returns a hex string', () => {
      const token = createSessionToken()
      assert.ok(token.length > 0)
      assert.match(token, /^[0-9a-f]+$/)
    })

    it('returns the same token for the same key', () => {
      const t1 = createSessionToken()
      const t2 = createSessionToken()
      assert.equal(t1, t2)
    })
  })

  describe('verifySessionToken', () => {
    it('accepts a valid token', () => {
      const token = createSessionToken()
      assert.ok(verifySessionToken(token))
    })

    it('rejects an invalid token', () => {
      assert.ok(!verifySessionToken('invalid-token'))
    })

    it('rejects an empty string', () => {
      assert.ok(!verifySessionToken(''))
    })
  })

  describe('verifyApiKey', () => {
    it('accepts the correct key', () => {
      assert.ok(verifyApiKey('test-secret-key-12345'))
    })

    it('rejects a wrong key', () => {
      assert.ok(!verifyApiKey('wrong-key'))
    })

    it('rejects an empty key', () => {
      assert.ok(!verifyApiKey(''))
    })
  })
})
