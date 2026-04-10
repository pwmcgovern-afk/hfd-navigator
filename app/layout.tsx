import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageContext'
import { TrackerProvider } from '@/components/TrackerContext'
import CrisisBanner from '@/components/CrisisBanner'
import AppFooter from '@/components/AppFooter'
import ChatWidget from '@/components/ChatWidget'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { Analytics } from '@vercel/analytics/react'
import PageViewTracker from '@/components/PageViewTracker'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Hartford Navigator',
  description: 'Find social services, benefits, and resources in Hartford, CT',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Hartford Navigator',
    description: '192 bilingual resources to help Hartford residents find food, housing, healthcare, and more.',
    url: 'https://www.hfdnavigator.com',
    siteName: 'Hartford Navigator',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: 'https://www.hfdnavigator.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Hartford Navigator — Find resources to help you thrive',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hartford Navigator',
    description: '192 bilingual resources to help Hartford residents find food, housing, healthcare, and more.',
    images: ['https://www.hfdnavigator.com/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D6E6E',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen">
        <LanguageProvider>
          <TrackerProvider>
            <main className="max-w-lg mx-auto">
              <CrisisBanner />
              {children}
              <AppFooter />
            </main>
            <ChatWidget />
            <ServiceWorkerRegistration />
          </TrackerProvider>
          <Analytics />
          <PageViewTracker />
        </LanguageProvider>
      </body>
    </html>
  )
}
