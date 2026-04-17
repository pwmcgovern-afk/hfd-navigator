// Next.js 14 instrumentation hook. Boots the Sentry SDK in the right
// runtime so server-side captureException calls land in the right place.
//
// This file is loaded automatically by Next.js when present at the project
// root (no further wiring needed).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
