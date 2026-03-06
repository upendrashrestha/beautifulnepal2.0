'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navigation from '../../../../components/Navigation'
import { initDatabase, getRouteById } from '../../../../lib/db'
import { getAltitudeGain, getTotalDistance } from '../../../../lib/routeService'
import type { TrekRoute, Waypoint } from '../../../../../types'

const MapViewer = dynamic(() => import('../../../../components/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-800 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-400">Loading map…</p>
      </div>
    </div>
  ),
})

export default function RoutePage() {
  const params = useParams()
  const routeId = params.routeId as string
  const [route, setRoute] = useState<TrekRoute | null>(null)
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'waypoints'>('map')
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    const load = async () => {
      await initDatabase()
      const data = await getRouteById(routeId)
      if (data) {
        setRoute(data)
        setSelectedWaypoint(data.waypoints[0])
      }
    }
    load()
  }, [routeId])

  const toggleTracking = () => {
    if (isTracking) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
      setIsTracking(false)
      setUserLocation(null)
    } else {
      const id = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('GPS error:', err),
        { enableHighAccuracy: true, timeout: 10000 }
      )
      watchId.current = id
      setIsTracking(true)
    }
  }

  // Distance to next waypoint
  const getDistanceToNext = (): string | null => {
    if (!userLocation || !route || !selectedWaypoint) return null
    const idx = route.waypoints.findIndex((w) => w.id === selectedWaypoint.id)
    const next = route.waypoints[idx + 1]
    if (!next) return null

    const R = 6371000
    const dLat = ((next.lat - userLocation.lat) * Math.PI) / 180
    const dLon = ((next.lng - userLocation.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.lat * Math.PI) / 180) *
      Math.cos((next.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const nextWaypoint =
    selectedWaypoint
      ? route.waypoints[route.waypoints.findIndex((w) => w.id === selectedWaypoint.id) + 1]
      : null
  const distToNext = getDistanceToNext()

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex items-center gap-3">
        <Link href="/trek" className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-lg">
          ←
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-500 truncate">{route.region}</p>
          <h1 className="font-bold text-white truncate">{route.name}</h1>
        </div>
        <button
          onClick={toggleTracking}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isTracking ? 'bg-blue-600 text-white' : 'bg-stone-800 text-stone-300'
            }`}
        >
          {isTracking ? '📍 On' : '📍 GPS'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-3 px-4 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { label: 'Days', value: route.durationDays },
          { label: 'Distance', value: `${getTotalDistance(route)}km` },
          { label: 'Gain', value: `${getAltitudeGain(route).toLocaleString()}m↑` },
          { label: 'Max Alt', value: `${route.maxAltitude.toLocaleString()}m` },
          { label: 'Stops', value: route.waypoints.length },
        ].map((s) => (
          <div key={s.label} className="shrink-0 bg-stone-900 rounded-xl px-3 py-2 text-center min-w-[70px]">
            <p className="text-xs text-stone-500">{s.label}</p>
            <p className="text-sm font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* GPS Info (when tracking) */}
      {isTracking && (
        <div className="mx-4 mb-3 p-3 bg-blue-900/30 border border-blue-800 rounded-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-400 font-medium">📍 GPS Active</span>
            {userLocation && (
              <span className="text-blue-300 text-xs">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            )}
          </div>
          {distToNext && nextWaypoint && (
            <p className="text-xs text-blue-300 mt-1">
              → {nextWaypoint.name}: <strong>{distToNext}</strong>
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-3">
        {(['map', 'waypoints'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-colors ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-stone-800 text-stone-400'
              }`}
          >
            {tab === 'map' ? '🗺️ Map' : '📍 Waypoints'}
          </button>
        ))}
      </div>

      {/* Map */}
      {activeTab === 'map' && (
        <div className="flex-1 px-4 min-h-[400px]">
          <MapViewer
            route={route}
            selectedWaypoint={selectedWaypoint}
            onWaypointSelect={setSelectedWaypoint}
            userLocation={userLocation}
            className="w-full h-[400px]"
          />
        </div>
      )}

      {/* Waypoints List */}
      {activeTab === 'waypoints' && (
        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          {route.waypoints.map((wp, i) => {
            const isSelected = selectedWaypoint?.id === wp.id
            const isFirst = i === 0
            const isLast = i === route.waypoints.length - 1

            return (
              <button
                key={wp.id}
                onClick={() => {
                  setSelectedWaypoint(wp)
                  setActiveTab('map')
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${isSelected
                    ? 'bg-orange-900/30 border-orange-600'
                    : 'bg-stone-900 border-stone-800'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                    <div className={`w-3 h-3 rounded-full border-2 ${isFirst ? 'bg-emerald-500 border-emerald-400' :
                        isLast ? 'bg-red-500 border-red-400' :
                          'bg-orange-500 border-orange-400'
                      }`} />
                    {!isLast && <div className="w-0.5 h-4 bg-stone-700" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-white text-sm">{wp.name}</p>
                      <span className="text-xs text-stone-400 shrink-0">{wp.altitude.toLocaleString()}m</span>
                    </div>
                    {wp.description && (
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{wp.description}</p>
                    )}
                    {wp.facilities && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {wp.facilities.map((f) => (
                          <span key={f} className="text-[10px] px-2 py-0.5 bg-stone-800 text-stone-400 rounded-full">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Navigation />
    </div>
  )
}
