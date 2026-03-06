import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Beautiful Nepal Trek Companion',
  description: 'Offline trekking companion for Everest Base Camp and Annapurna Circuit treks in Nepal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Trek Companion',
  },
  formatDetection: { telephone: true },
  openGraph: {
    title: 'BeautifulNepal Trek Companion — Offline Navigation',
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
