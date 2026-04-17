// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'no-cache' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
  ],
}

// Wrap with Sentry only when (a) the SDK is installed and (b) a DSN is set.
// This keeps `next build` green in environments without Sentry while still
// activating production error tracking once Pat sets NEXT_PUBLIC_SENTRY_DSN.
let exportedConfig = nextConfig
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { withSentryConfig } = require('@sentry/nextjs')
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    exportedConfig = withSentryConfig(nextConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Tunnel route avoids ad-blockers eating client error reports.
      tunnelRoute: '/monitoring',
      // Source-map upload only runs when CI provides an auth token.
      sourcemaps: {
        disable: !process.env.SENTRY_AUTH_TOKEN,
      },
    })
  }
} catch {
  // @sentry/nextjs not installed — ship plain config.
}

module.exports = exportedConfig
