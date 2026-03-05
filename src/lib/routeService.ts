import {
  getAllRoutes,
  getRouteById,
  updateRoutes,
  updatePhrases,
  getVersionMeta,
} from "./db";
import type { TrekRoute, Phrase, VersionInfo } from "../../types";

// ─── Route Service ─────────────────────────────────────────────────────────────

export async function fetchRoutes(): Promise<TrekRoute[]> {
  return getAllRoutes();
}

export async function fetchRoute(id: string): Promise<TrekRoute | undefined> {
  return getRouteById(id);
}

// ─── Version Check & Sync ─────────────────────────────────────────────────────

export async function checkForUpdates(): Promise<boolean> {
  try {
    const response = await fetch("/api/trek/version", { cache: "no-store" });
    if (!response.ok) return false;

    const remoteVersion: VersionInfo = await response.json();
    const localVersion = await getVersionMeta();

    const needsRoutesUpdate =
      Number(localVersion.routes ?? 0) < remoteVersion.routes;
    const needsPhrasesUpdate =
      Number(localVersion.phrases ?? 0) < remoteVersion.phrases;

    return needsRoutesUpdate || needsPhrasesUpdate;
  } catch {
    return false;
  }
}

export async function syncData(): Promise<{
  routes: boolean;
  phrases: boolean;
}> {
  const result = { routes: false, phrases: false };

  try {
    // Sync routes
    const routesRes = await fetch("/api/trek/routes");
    if (routesRes.ok) {
      const routes: TrekRoute[] = await routesRes.json();
      await updateRoutes(routes);
      result.routes = true;
    }
  } catch {
    console.warn("Failed to sync routes");
  }

  try {
    // Sync phrases
    const phrasesRes = await fetch("/api/trek/phrases");
    if (phrasesRes.ok) {
      const phrases: Phrase[] = await phrasesRes.json();
      await updatePhrases(phrases);
      result.phrases = true;
    }
  } catch {
    console.warn("Failed to sync phrases");
  }

  return result;
}

// ─── Computed Route Stats ─────────────────────────────────────────────────────

export function getTotalDistance(route: TrekRoute): number {
  return route.waypoints.reduce(
    (sum, wp) => sum + (wp.distanceFromPrev ?? 0),
    0,
  );
}

export function getAltitudeGain(route: TrekRoute): number {
  let gain = 0;
  for (let i = 1; i < route.waypoints.length; i++) {
    const diff = route.waypoints[i].altitude - route.waypoints[i - 1].altitude;
    if (diff > 0) gain += diff;
  }
  return gain;
}

export function getRouteCenter(route: TrekRoute): [number, number] {
  const lats = route.waypoints.map((w) => w.lat);
  const lngs = route.waypoints.map((w) => w.lng);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2,
  ];
}

export function getRouteGeoJSON(route: TrekRoute): GeoJSON.FeatureCollection {
  const coordinates = route.waypoints.map((wp) => [wp.lng, wp.lat]);

  return {
    type: "FeatureCollection",
    features: [
      // Route line
      {
        type: "Feature",
        geometry: { type: "LineString", coordinates },
        properties: { name: route.name, routeId: route.id },
      },
      // Waypoint markers
      ...route.waypoints.map((wp, i) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [wp.lng, wp.lat] },
        properties: {
          id: wp.id,
          name: wp.name,
          altitude: wp.altitude,
          description: wp.description,
          index: i,
          isStart: i === 0,
          isEnd: i === route.waypoints.length - 1,
        },
      })),
    ],
  };
}
