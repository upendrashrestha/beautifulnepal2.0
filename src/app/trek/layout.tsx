import type { Metadata, Viewport } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Beautiful Nepal Trek Companion',
  description: 'Offline trekking companion for Everest Base Camp and Annapurna Circuit treks in Nepal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Trek Nepal',
  },
  formatDetection: { telephone: true },
  // ── Required for iOS Add to Home Screen icon ───────────────────────────
  icons: {
    apple: [
      { url: '/icons/manifest-icon-192.maskable.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/manifest-icon-512.maskable.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Beautiful Nepal Trek Companion — Offline Navigation',
    description: 'Navigate Everest Base Camp and Annapurna Circuit offline',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function TrekLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-lg mx-auto relative bg-stone-950 min-h-screen">
      {children}
    </div>
  )
}