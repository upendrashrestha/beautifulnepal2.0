'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import { initDatabase, getAllPhrases } from '../../../lib/db'
import type { Phrase, PhraseCategory } from '../../../types'

const categoryEmojis: Record<string, string> = {
  Greetings: '👋',
  Directions: '🧭',
  'Food & Water': '🍜',
  Medical: '🏥',
  Numbers: '🔢',
  Accommodation: '🛏️',
  General: '💡',
}

export default function LanguagePage() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Greetings')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await initDatabase()
      const data = await getAllPhrases()
      setPhrases(data)
      setLoading(false)
    }
    load()
  }, [])

  const categories = [...new Set(phrases.map((p) => p.category))] as PhraseCategory[]

  const filtered = phrases.filter((p) => {
    const matchesCategory = p.category === activeCategory
    const matchesSearch =
      search.length === 0 ||
      p.english.toLowerCase().includes(search.toLowerCase()) ||
      p.nepali.includes(search) ||
      p.pronunciation.toLowerCase().includes(search.toLowerCase())
    return search.length > 0 ? matchesSearch : matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-stone-950 text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/trek" className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center">
            ←
          </Link>
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Offline Available</p>
            <h1 className="font-black text-xl text-white">Nepali Phrases</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">🔍</span>
          <input
            type="search"
            placeholder="Search phrases…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      {search.length === 0 && (
        <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              <span>{categoryEmojis[cat] ?? '📖'}</span>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Phrases */}
      <div className="px-4 space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-stone-900 rounded-2xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">No phrases found</p>
          </div>
        ) : (
          filtered.map((phrase) => {
            const isOpen = expanded === phrase.id
            return (
              <button
                key={phrase.id}
                onClick={() => setExpanded(isOpen ? null : phrase.id)}
                className="w-full text-left bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-stone-700 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <p className="font-semibold text-white text-sm">{phrase.english}</p>
                      <span className="text-xs text-stone-500">{phrase.category}</span>
                    </div>
                    <p className="text-xl mt-1 font-medium" style={{ fontFamily: 'serif' }}>
                      {phrase.nepali}
                    </p>
                  </div>
                  <span className={`text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 uppercase tracking-wider">Pronunciation</span>
                      <span className="flex-1 h-px bg-stone-800" />
                    </div>
                    <p className="text-orange-300 font-medium mt-1 text-base tracking-wide">
                      {phrase.pronunciation}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 italic">
                      Tip: Speak slowly and clearly. Nepali people appreciate any attempt!
                    </p>
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>

      <Navigation />
    </div>
  )
}
