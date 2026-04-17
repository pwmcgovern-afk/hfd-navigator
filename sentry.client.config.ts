// Browser-side Sentry init.
//
// Inert when NEXT_PUBLIC_SENTRY_DSN is unset — we still call Sentry.init so
// the global captureException calls in app code don't throw, but with no
// DSN no events are transmitted.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  // Sample 10% of normal sessions, 100% of sessions where an error fires.
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  // Filter out browser extension noise that the SDK can't fix for us.
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
})
