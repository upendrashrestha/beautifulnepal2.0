'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  downloadMapPack,
  deleteMapPack,
  isMapPackDownloaded,
  formatBytes,
  MAP_PACKS,
} from '../lib/mapDownloader'
import {
  getDownloadPacks,
  upsertDownloadPack,
  getStorageInfo,
} from '../lib/db'
import type { DownloadPack, StorageInfo } from '../types'

const ROUTE_PACKS: DownloadPack[] = [
  { id: 'route-everest-base-camp', name: 'Everest Route Data', type: 'route', routeId: 'everest-base-camp', sizeBytes: 48000, version: 1, status: 'idle' },
  { id: 'route-annapurna-circuit', name: 'Annapurna Route Data', type: 'route', routeId: 'annapurna-circuit', sizeBytes: 62000, version: 1, status: 'idle' },
  { id: 'map-everest-base-camp', name: 'Everest Map Pack', type: 'map', routeId: 'everest-base-camp', sizeBytes: 180 * 1024 * 1024, version: 1, status: 'idle' },
  { id: 'map-annapurna-circuit', name: 'Annapurna Map Pack', type: 'map', routeId: 'annapurna-circuit', sizeBytes: 280 * 1024 * 1024, version: 1, status: 'idle' },
  { id: 'language-pack', name: 'Nepali Language Pack', type: 'language', sizeBytes: 24000, version: 1, status: 'idle' },
]

export default function DownloadManager() {
  const [packs, setPacks] = useState<DownloadPack[]>(ROUTE_PACKS)
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({ used: 0, available: 0, quota: 0 })
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())
  const abortControllers = useRef<Map<string, AbortController>>(new Map())

  const loadState = useCallback(async () => {
    const saved = await getDownloadPacks()
    const savedMap = Object.fromEntries(saved.map((p) => [p.id, p]))

    setPacks(
      ROUTE_PACKS.map((p) => ({
        ...p,
        ...savedMap[p.id],
      }))
    )

    const info = await getStorageInfo()
    setStorageInfo(info)
  }, [])

  useEffect(() => {
    loadState()
  }, [loadState])

  const handleDownload = async (pack: DownloadPack) => {
    if (downloadingIds.has(pack.id)) return

    const controller = new AbortController()
    abortControllers.current.set(pack.id, controller)
    setDownloadingIds((prev) => new Set([...prev, pack.id]))

    try {
      if (pack.type === 'map' && pack.routeId) {
        const updated: DownloadPack = { ...pack, status: 'downloading', progress: 0 }
        await upsertDownloadPack(updated)
        setPacks((prev) => prev.map((p) => (p.id === pack.id ? updated : p)))

        await downloadMapPack(pack.routeId, (progress) => {
          setPacks((prev) =>
            prev.map((p) => (p.id === pack.id ? { ...p, progress, status: 'downloading' } : p))
          )
        }, controller.signal)
      } else {
        // Simulate route/language pack download
        const steps = [0, 25, 50, 75, 100]
        for (const progress of steps) {
          if (controller.signal.aborted) break
          await new Promise((r) => setTimeout(r, 300))
          const updated: DownloadPack = { ...pack, status: progress === 100 ? 'complete' : 'downloading', progress, downloadedAt: progress === 100 ? Date.now() : undefined }
          await upsertDownloadPack(updated)
          setPacks((prev) => prev.map((p) => (p.id === pack.id ? updated : p)))
        }
      }

      await loadState()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage !== 'Download cancelled') {
        const failed: DownloadPack = { ...pack, status: 'error' }
        await upsertDownloadPack(failed)
        setPacks((prev) => prev.map((p) => (p.id === pack.id ? failed : p)))
      }
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev)
        next.delete(pack.id)
        return next
      })
      abortControllers.current.delete(pack.id)
    }
  }

  const handleDelete = async (pack: DownloadPack) => {
    if (pack.type === 'map' && pack.routeId) {
      await deleteMapPack(pack.routeId)
    } else {
      const reset: DownloadPack = { ...pack, status: 'idle', downloadedAt: undefined, progress: undefined }
      await upsertDownloadPack(reset)
    }
    await loadState()
  }

  const handleCancel = (packId: string) => {
    abortControllers.current.get(packId)?.abort()
  }

  const storagePercent = storageInfo.quota > 0 ? Math.round((storageInfo.used / storageInfo.quota) * 100) : 0

  const typeIcons: Record<string, string> = { map: '🗺️', route: '🥾', language: '💬' }

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <div className="bg-stone-900 rounded-2xl p-5 border border-stone-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-stone-300">Device Storage</span>
          <span className="text-xs text-stone-400">
            {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}
          </span>
        </div>
        <div className="w-full bg-stone-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${storagePercent}%`,
              background: storagePercent > 80 ? '#EF4444' : storagePercent > 60 ? '#F97316' : '#22C55E',
            }}
          />
        </div>
        <p className="text-xs text-stone-500 mt-2">{storagePercent}% used</p>
      </div>

      {/* Packs */}
      <div className="space-y-3">
        {packs.map((pack) => {
          const isDownloading = downloadingIds.has(pack.id)
          const isComplete = pack.status === 'complete'
          const isError = pack.status === 'error'

          return (
            <div
              key={pack.id}
              className="bg-stone-900 rounded-2xl p-4 border border-stone-700"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{typeIcons[pack.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white text-sm truncate">{pack.name}</p>
                    <span className="text-xs text-stone-400 shrink-0">
                      {isComplete ? formatBytes(pack.sizeBytes) : `~${formatBytes(pack.sizeBytes)}`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {isDownloading && pack.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-stone-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-orange-500 transition-all duration-300"
                          style={{ width: `${pack.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-1">{pack.progress}% downloaded</p>
                    </div>
                  )}

                  {isComplete && pack.downloadedAt && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ Downloaded {new Date(pack.downloadedAt).toLocaleDateString()}
                    </p>
                  )}

                  {isError && (
                    <p className="text-xs text-red-400 mt-1">Download failed — tap to retry</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                  {isComplete && (
                    <button
                      onClick={() => handleDelete(pack)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-stone-700 text-stone-300 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {isDownloading && (
                    <button
                      onClick={() => handleCancel(pack.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-stone-700 text-stone-300 hover:bg-stone-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {(pack.status === 'idle' || isError) && (
                    <button
                      onClick={() => handleDownload(pack)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
                    >
                      {isError ? 'Retry' : 'Download'}
                    </button>
                  )}
                  {isDownloading && (
                    <div className="flex items-center justify-center w-8 h-8">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Download All Button */}
      <button
        onClick={() => packs.filter((p) => p.status !== 'complete').forEach(handleDownload)}
        disabled={downloadingIds.size > 0}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        Download All Offline Data
      </button>

      <p className="text-xs text-stone-500 text-center">
        Download map packs before your trek for offline navigation
      </p>
    </div>
  )
}
