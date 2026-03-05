'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { TrekRoute, Waypoint } from '../types'
import { getRouteGeoJSON, getRouteCenter } from '../lib/routeService'
import { getOnlineMapStyle } from '../lib/mapDownloader'

interface MapViewerProps {
  route: TrekRoute
  selectedWaypoint?: Waypoint | null
  onWaypointSelect?: (waypoint: Waypoint) => void
  userLocation?: { lat: number; lng: number } | null
  className?: string
}

export default function MapViewer({
  route,
  selectedWaypoint,
  onWaypointSelect,
  userLocation,
  className = '',
}: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const initMap = useCallback(async () => {
    if (!mapContainer.current || mapRef.current) return

    try {
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')

      const center = getRouteCenter(route)
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: getOnlineMapStyle() as maplibregl.StyleSpecification,
        center: center,
        zoom: 10,
        attributionControl: true,
      })

      mapRef.current = map

      map.on('load', () => {
        const geojson = getRouteGeoJSON(route)

        // Add route line source
        map.addSource('route', {
          type: 'geojson',
          data: geojson as GeoJSON.FeatureCollection,
        })

        // Trek path line (glow effect)
        map.addLayer({
          id: 'route-line-glow',
          type: 'line',
          source: 'route',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#F97316',
            'line-width': 8,
            'line-opacity': 0.3,
          },
        })

        // Trek path line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#F97316',
            'line-width': 3,
            'line-dasharray': [1, 0],
          },
        })

        // Waypoint circles
        map.addLayer({
          id: 'waypoints',
          type: 'circle',
          source: 'route',
          filter: ['==', '$type', 'Point'],
          paint: {
            'circle-radius': [
              'case',
              ['any', ['get', 'isStart'], ['get', 'isEnd']], 10,
              7,
            ],
            'circle-color': [
              'case',
              ['get', 'isEnd'], '#EF4444',
              ['get', 'isStart'], '#22C55E',
              '#F97316',
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        })

        // Waypoint labels
        map.addLayer({
          id: 'waypoint-labels',
          type: 'symbol',
          source: 'route',
          filter: ['==', '$type', 'Point'],
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 11,
            'text-offset': [0, -1.5],
            'text-anchor': 'bottom',
          },
          paint: {
            'text-color': '#1e293b',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2,
          },
        })

        // Click handler for waypoints
        map.on('click', 'waypoints', (e) => {
          if (!e.features?.[0]) return
          const props = e.features[0].properties
          const waypoint = route.waypoints.find((w) => w.id === props.id)
          if (waypoint) onWaypointSelect?.(waypoint)
        })

        map.on('mouseenter', 'waypoints', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'waypoints', () => {
          map.getCanvas().style.cursor = ''
        })

        setIsLoaded(true)
      })

      map.on('error', (e) => {
        console.warn('Map error:', e)
        setMapError('Map tiles unavailable offline')
      })

      // Add navigation controls
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        'bottom-right'
      )

      // Add scale
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left')
    } catch (err) {
      console.error('Failed to initialize map:', err)
      setMapError('Map failed to load. Ensure MapLibre GL JS is installed.')
    }
  }, [route, onWaypointSelect])

  useEffect(() => {
    initMap()
    return () => {
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [initMap])

  // Fly to selected waypoint
  useEffect(() => {
    if (!mapRef.current || !selectedWaypoint || !isLoaded) return
    const map = mapRef.current as { flyTo: (opts: object) => void }
    map.flyTo({
      center: [selectedWaypoint.lng, selectedWaypoint.lat],
      zoom: 13,
      duration: 1500,
    })
  }, [selectedWaypoint, isLoaded])

  // Show user location
  useEffect(() => {
    if (!mapRef.current || !userLocation || !isLoaded) return
    const map = mapRef.current as {
      getSource: (id: string) => unknown
      addSource: (id: string, source: object) => void
      addLayer: (layer: object) => void
    }

    const locationGeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [userLocation.lng, userLocation.lat] },
        properties: {},
      }],
    }

    if (map.getSource('user-location')) {
      const src = map.getSource('user-location') as { setData: (d: unknown) => void }
      src.setData(locationGeoJSON)
    } else {
      map.addSource('user-location', { type: 'geojson', data: locationGeoJSON })
      map.addLayer({
        id: 'user-location-pulse',
        type: 'circle',
        source: 'user-location',
        paint: {
          'circle-radius': 16,
          'circle-color': '#3B82F6',
          'circle-opacity': 0.2,
        },
      })
      map.addLayer({
        id: 'user-location-dot',
        type: 'circle',
        source: 'user-location',
        paint: {
          'circle-radius': 8,
          'circle-color': '#3B82F6',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      })
    }
  }, [userLocation, isLoaded])

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />

      {!isLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-stone-500">Loading map…</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-xl">
          <div className="text-center px-4">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-medium text-stone-700">{mapError}</p>
            <p className="text-xs text-stone-500 mt-1">Download map pack for offline use</p>
          </div>
        </div>
      )}
    </div>
  )
}
