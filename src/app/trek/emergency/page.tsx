'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import { initDatabase, getAllEmergencyContacts } from '../../../lib/db'
import type { EmergencyContact, ContactCategory } from '../../../../types'

const categoryConfig: Record<ContactCategory, { emoji: string; color: string; bg: string }> = {
  Police: { emoji: '👮', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800' },
  Medical: { emoji: '🏥', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-800' },
  Rescue: { emoji: '🚁', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-800' },
  Embassy: { emoji: '🏛️', color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-800' },
  General: { emoji: 'ℹ️', color: 'text-stone-400', bg: 'bg-stone-900/50 border-stone-700' },
}

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [activeCategory, setActiveCategory] = useState<ContactCategory | 'All'>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await initDatabase()
      const data = await getAllEmergencyContacts()
      setContacts(data)
      setLoading(false)
    }
    load()
  }, [])

  const categories: ContactCategory[] = ['Police', 'Medical', 'Rescue', 'Embassy', 'General']

  const filtered =
    activeCategory === 'All'
      ? contacts
      : contacts.filter((c) => c.category === activeCategory)

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white pb-24">
      {/* SOS Header */}
      <div className="relative bg-gradient-to-b from-red-950 to-stone-950 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/trek" className="w-9 h-9 rounded-xl bg-stone-800/50 flex items-center justify-center">
            ←
          </Link>
          <div>
            <p className="text-xs text-red-400 uppercase tracking-widest font-bold">Always Available Offline</p>
            <h1 className="font-black text-xl text-white">Emergency Contacts</h1>
          </div>
        </div>

        {/* Emergency banner */}
        <div
          className="bg-red-600 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-red-500 transition-colors active:scale-[0.98]"
          onClick={() => makeCall('112')}
        >
          <div>
            <p className="font-black text-white text-lg">🆘 Nepal Emergency</p>
            <p className="text-red-200 text-sm">Police · Fire · Medical</p>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-3xl tracking-wide">112</p>
            <p className="text-red-200 text-xs">Tap to call</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {(['All', ...categories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${activeCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
          >
            {cat !== 'All' && <span>{categoryConfig[cat]?.emoji}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="px-4 space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-stone-900 rounded-2xl animate-pulse" />
          ))
        ) : (
          filtered.map((contact) => {
            const config = categoryConfig[contact.category]
            return (
              <div
                key={contact.id}
                className={`bg-stone-900 border rounded-2xl p-4 ${config.bg}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{config.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-white text-sm">{contact.name}</p>
                        {contact.location && (
                          <p className="text-xs text-stone-500">{contact.location}</p>
                        )}
                      </div>
                      {contact.available24h && (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-emerald-900/50 text-emerald-400 border border-emerald-800 rounded-full">
                          24/7
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">
                      {contact.description}
                    </p>

                    {/* Call buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => makeCall(contact.phone)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        📞 {contact.phone}
                      </button>
                      {contact.altPhone && (
                        <button
                          onClick={() => makeCall(contact.altPhone!)}
                          className="flex items-center justify-center gap-1 px-3 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-xs font-medium rounded-xl transition-colors"
                        >
                          Alt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Altitude sickness info */}
      <div className="mx-4 mt-6 p-4 bg-amber-900/20 border border-amber-800 rounded-2xl">
        <h3 className="font-bold text-amber-400 mb-2">⚠️ Altitude Sickness (AMS)</h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          Symptoms: headache, nausea, dizziness, fatigue above 2500m.{' '}
          <strong className="text-white">If severe: descend immediately.</strong>{' '}
          Do not ascend if you have symptoms. Contact HRA aid posts in Pheriche (EBC) or Manang (Annapurna).
        </p>
      </div>

      <Navigation />
    </div>
  )
}
