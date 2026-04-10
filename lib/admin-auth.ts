import { createHmac, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const COOKIE_NAME = 'admin_session'
const SESSION_PAYLOAD = 'hartford-navigator-admin-session'

function getAdminKey(): string {
  const key = process.env.ADMIN_API_KEY
  if (!key) throw new Error('ADMIN_API_KEY not configured')
  return key
}

// Hash password for storage using bcrypt (work factor 12)
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function createSessionToken(): string {
  const key = getAdminKey()
  return createHmac('sha256', key).update(SESSION_PAYLOAD).digest('hex')
}

// Create session token for a specific admin user
export function createUserSessionToken(userId: string): string {
  const key = getAdminKey()
  return createHmac('sha256', key).update(`user:${userId}`).digest('hex') + ':' + userId
}

export function verifySessionToken(token: string): boolean {
  try {
    // Check if it's a user-specific token (format: hmac:userId)
    if (token.includes(':')) {
      const [hmac, userId] = token.split(':')
      const key = getAdminKey()
      const expected = createHmac('sha256', key).update(`user:${userId}`).digest('hex')
      const hmacBuf = Buffer.from(hmac, 'utf8')
      const expectedBuf = Buffer.from(expected, 'utf8')
      if (hmacBuf.length !== expectedBuf.length) return false
      return timingSafeEqual(hmacBuf, expectedBuf)
    }

    // Legacy API key session
    const expected = createSessionToken()
    const tokenBuf = Buffer.from(token, 'utf8')
    const expectedBuf = Buffer.from(expected, 'utf8')
    if (tokenBuf.length !== expectedBuf.length) return false
    return timingSafeEqual(tokenBuf, expectedBuf)
  } catch {
    return false
  }
}

export function verifyApiKey(key: string): boolean {
  try {
    const expected = getAdminKey()
    const keyBuf = Buffer.from(key, 'utf8')
    const expectedBuf = Buffer.from(expected, 'utf8')
    if (keyBuf.length !== expectedBuf.length) return false
    return timingSafeEqual(keyBuf, expectedBuf)
  } catch {
    return false
  }
}

// Verify email/password login
export async function verifyEmailPassword(email: string, password: string): Promise<string | null> {
  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user) return null

  // Support both bcrypt and legacy SHA-256 hashes during migration
  const isBcrypt = user.passwordHash.startsWith('$2')
  if (isBcrypt) {
    if (!bcrypt.compareSync(password, user.passwordHash)) return null
  } else {
    // Legacy SHA-256 — upgrade to bcrypt on successful login
    const { createHash } = await import('crypto')
    const legacyHash = createHash('sha256').update(password).digest('hex')
    if (legacyHash !== user.passwordHash) return null
    // Upgrade the hash
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: bcrypt.hashSync(password, 12) }
    })
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  return user.id
}

export function isAdminAuthenticated(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    if (verifyApiKey(token)) return true
  }

  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (match) {
    return verifySessionToken(match[1])
  }

  return false
}

export function requireAdmin(req: Request): Response | null {
  if (!isAdminAuthenticated(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
  return null
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME

export function getAdminCookieOptions(token?: string): string {
  const sessionToken = token || createSessionToken()
  const maxAge = 60 * 60 * 24 * 7
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=${sessionToken}; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=${maxAge}${secure}`
}

export function getClearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/admin; Max-Age=0`
}
