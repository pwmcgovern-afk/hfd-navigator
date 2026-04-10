'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Tracks page views by sending a non-blocking POST on navigation
export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Extract resource ID and category from URL
    const resourceMatch = pathname.match(/^\/resources\/([^/]+)$/)
    const categoryMatch = pathname.match(/^\/category\/([^/]+)$/)

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        resourceId: resourceMatch?.[1] || null,
        category: categoryMatch?.[1] || null,
      }),
    }).catch(() => {}) // Fire and forget
  }, [pathname])

  return null
}
