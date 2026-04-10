import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'

// Simple cookie check — just verify the cookie exists and has reasonable length
// Full HMAC verification happens in the API routes via requireAdmin()
// Edge middleware can't use Node crypto, so we do a lightweight check here
function hasValidSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  // Session tokens are hex strings (64+ chars for HMAC-SHA256, or longer for user tokens)
  return cookieValue.length >= 64 && /^[0-9a-f:]+$/.test(cookieValue)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin page protection (API routes handle their own auth via requireAdmin)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value
    if (!hasValidSessionCookie(sessionCookie)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.png|favicon\\.svg|icon-.*\\.png|apple-touch-icon\\.png|manifest\\.json|sw\\.js).*)',
  ],
}
