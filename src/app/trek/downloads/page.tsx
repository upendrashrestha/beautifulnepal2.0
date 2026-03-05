'use client'

import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import DownloadManager from '../../../components/DownloadManager'

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white pb-24">
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/trek" className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center">
            ←
          </Link>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Offline Ready</p>
            <h1 className="font-black text-xl text-white">Download Manager</h1>
          </div>
        </div>
        <p className="text-sm text-stone-400 ml-12">
          Save maps and data for offline use before you start trekking.
        </p>
      </div>

      <div className="px-4">
        <DownloadManager />
      </div>

      <Navigation />
    </div>
  )
}
