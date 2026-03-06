'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import { initDatabase, getAllRoutes } from '../../lib/db'
import type { TrekRoute } from '../../../types'
import banner from "@/assets/banner.jpg";
const difficultyColors: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-900/30',
  Moderate: 'text-yellow-400 bg-yellow-900/30',
  Hard: 'text-orange-400 bg-orange-900/30',
  Extreme: 'text-red-400 bg-red-900/30',
}

export default function TrekHomePage() {
  const [routes, setRoutes] = useState<TrekRoute[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      await initDatabase()
      const data = await getAllRoutes()
      setRoutes(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-stone-950 text-white pb-24">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${banner.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950" />
        <div className="relative px-5 pt-14 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-400 mb-1">Offline Companion</p>
              <h1 className="text-3xl font-black text-white leading-tight">
                Beautiful Nepal<br />Trek Companion
              </h1>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-stone-800 text-stone-400 border border-stone-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-stone-500'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          <p className="text-stone-400 text-sm leading-relaxed">
            Navigate Nepal&apos;s greatest trails — even without signal.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: '/trek/emergency', icon: '🆘', label: 'Emergency', color: 'bg-red-900/30 border-red-800' },
            { href: '/trek/language', icon: '💬', label: 'Phrases', color: 'bg-blue-900/30 border-blue-800' },
            { href: '/trek/downloads', icon: '📥', label: 'Downloads', color: 'bg-orange-900/30 border-orange-800' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${action.color} hover:opacity-80 transition-opacity`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold text-stone-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Routes */}
      <div className="px-5">
        <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-stone-400 mb-4">
          Available Treks
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-stone-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <Link
                key={route.id}
                href={`/trek/routes/${route.id}`}
                className="block bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-orange-700 transition-colors active:scale-[0.98]"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-stone-500 mb-1">{route.region}</p>
                      <h3 className="font-bold text-white text-lg leading-tight">{route.name}</h3>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${difficultyColors[route.difficulty]}`}>
                      {route.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-stone-400 leading-relaxed mb-4 line-clamp-2">
                    {route.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Duration', value: `${route.durationDays} days` },
                      { label: 'Distance', value: `${route.distanceKm} km` },
                      { label: 'Max Alt', value: `${route.maxAltitude.toLocaleString()}m` },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-stone-800 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-stone-500 mb-0.5">{stat.label}</p>
                        <p className="text-sm font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {route.waypoints.slice(0, 5).map((wp) => (
                        <span
                          key={wp.id}
                          className="w-2 h-2 rounded-full bg-orange-500 border border-stone-900"
                          title={wp.name}
                        />
                      ))}
                      {route.waypoints.length > 5 && (
                        <span className="text-xs text-stone-500 ml-2">+{route.waypoints.length - 5} stops</span>
                      )}
                    </div>
                    <span className="text-orange-400 text-sm font-semibold">View Route →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
