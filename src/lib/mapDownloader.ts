import {
  saveMapTile,
  deleteRouteMapTiles,
  upsertDownloadPack,
  countRouteMapTiles,
} from "./db";
import type { DownloadPack } from "../../types";

// ─── Map Pack Definitions ─────────────────────────────────────────────────────

export const MAP_PACKS: Record<
  string,
  {
    name: string;
    tileUrl: string;
    bounds: [number, number, number, number];
    minZoom: number;
    maxZoom: number;
    estimatedTiles: number;
  }
> = {
  "everest-base-camp": {
    name: "Everest Base Camp Map Pack",
    // Using OpenTopoMap as a free tile provider; in production swap for self-hosted MBTiles
    tileUrl: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    bounds: [86.5, 27.7, 87.0, 28.1],
    minZoom: 8,
    maxZoom: 14,
    estimatedTiles: 1200,
  },
  "annapurna-circuit": {
    name: "Annapurna Circuit Map Pack",
    tileUrl: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    bounds: [83.7, 28.2, 84.4, 29.0],
    minZoom: 8,
    maxZoom: 14,
    estimatedTiles: 2400,
  },
};

// ─── Tile Coordinate Helpers ──────────────────────────────────────────────────

function lon2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom),
  );
}

function getTilesForBounds(
  bounds: [number, number, number, number],
  minZoom: number,
  maxZoom: number,
): Array<{ z: number; x: number; y: number }> {
  const [west, south, east, north] = bounds;
  const tiles: Array<{ z: number; x: number; y: number }> = [];

  for (let z = minZoom; z <= maxZoom; z++) {
    const xMin = lon2tile(west, z);
    const xMax = lon2tile(east, z);
    const yMin = lat2tile(north, z);
    const yMax = lat2tile(south, z);

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        tiles.push({ z, x, y });
      }
    }
  }

  return tiles;
}

// ─── Download Map Pack ────────────────────────────────────────────────────────

export type DownloadProgressCallback = (
  progress: number,
  downloaded: number,
  total: number,
) => void;

export async function downloadMapPack(
  routeId: string,
  onProgress?: DownloadProgressCallback,
  signal?: AbortSignal,
): Promise<void> {
  const pack = MAP_PACKS[routeId];
  if (!pack) throw new Error(`Unknown route ID: ${routeId}`);

  const tiles = getTilesForBounds(pack.bounds, pack.minZoom, pack.maxZoom);
  const total = tiles.length;

  const downloadPack: DownloadPack = {
    id: `map-${routeId}`,
    name: pack.name,
    type: "map",
    routeId,
    sizeBytes: 0,
    version: 1,
    status: "downloading",
    progress: 0,
  };
  await upsertDownloadPack(downloadPack);

  let downloaded = 0;
  let totalBytes = 0;
  const BATCH_SIZE = 8; // concurrent downloads

  try {
    for (let i = 0; i < tiles.length; i += BATCH_SIZE) {
      if (signal?.aborted) throw new Error("Download cancelled");

      const batch = tiles.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async ({ z, x, y }) => {
          try {
            const url = pack.tileUrl
              .replace("{z}", String(z))
              .replace("{x}", String(x))
              .replace("{y}", String(y));
            const res = await fetch(url, { signal });
            if (!res.ok) return;

            const data = await res.arrayBuffer();
            const contentType = res.headers.get("content-type") ?? "image/png";
            totalBytes += data.byteLength;

            await saveMapTile({ routeId, z, x, y, data, contentType });
          } catch (err) {
            console.error(`Error downloading tile (${z}, ${x}, ${y}):`, err);
            // Skip failed tiles gracefully
          } finally {
            downloaded++;
          }
        }),
      );

      const progress = Math.round((downloaded / total) * 100);
      onProgress?.(progress, downloaded, total);

      // Update progress in DB
      await upsertDownloadPack({
        ...downloadPack,
        progress,
        sizeBytes: totalBytes,
        status: "downloading",
      });
    }

    await upsertDownloadPack({
      ...downloadPack,
      sizeBytes: totalBytes,
      downloadedAt: Date.now(),
      status: "complete",
      progress: 100,
    });
  } catch (err) {
    await upsertDownloadPack({ ...downloadPack, status: "error" });
    throw err;
  }
}

// ─── Load Offline Map Config ──────────────────────────────────────────────────

export function getOfflineMapStyle(routeId: string): object {
  // Return a MapLibre style using offline tile protocol
  return {
    version: 8,
    sources: {
      "offline-tiles": {
        type: "raster",
        tiles: [`offline-tiles://${routeId}/{z}/{x}/{y}`],
        tileSize: 256,
        attribution: "© OpenTopoMap contributors",
      },
    },
    layers: [
      {
        id: "offline-tiles-layer",
        type: "raster",
        source: "offline-tiles",
      },
    ],
  };
}

export function getOnlineMapStyle(): object {
  return {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenTopoMap contributors",
        maxzoom: 17,
      },
    },
    layers: [
      {
        id: "osm-tiles-layer",
        type: "raster",
        source: "osm-tiles",
      },
    ],
  };
}

// ─── Delete Map Pack ──────────────────────────────────────────────────────────

export async function deleteMapPack(routeId: string): Promise<void> {
  await deleteRouteMapTiles(routeId);
  await upsertDownloadPack({
    id: `map-${routeId}`,
    name: MAP_PACKS[routeId]?.name ?? routeId,
    type: "map",
    routeId,
    sizeBytes: 0,
    version: 1,
    status: "idle",
  });
}

// ─── Check Map Pack Status ────────────────────────────────────────────────────

export async function isMapPackDownloaded(routeId: string): Promise<boolean> {
  const count = await countRouteMapTiles(routeId);
  return count > 0;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
