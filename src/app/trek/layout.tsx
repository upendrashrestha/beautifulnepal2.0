import type { Metadata, Viewport } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'BN Trek',
  description: 'Offline trekking companion for Everest Base Camp and Annapurna Circuit treks in Nepal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BN Trek',
  },
  formatDetection: { telephone: true },
  // ── Required for iOS Add to Home Screen icon ───────────────────────────
  icons: {
    apple: [
      { url: '/icons/banner-app-icon.jpg', sizes: '512x512', type: 'image/jpeg' },
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
    <div className="max-w-lg mx-auto relative bg-stone-950 min-h-screen pt-[env(safe-area-inset-top)]">
      {children}
    </div>
  )
}