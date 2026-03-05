import Dexie, { type Table } from "dexie";
import type {
  TrekRoute,
  Phrase,
  EmergencyContact,
  DownloadPack,
} from "../../types";

// ─── Database Schema ──────────────────────────────────────────────────────────

export class TrekDatabase extends Dexie {
  routes!: Table<TrekRoute>;
  phrases!: Table<Phrase>;
  emergencyContacts!: Table<EmergencyContact>;
  downloadedMaps!: Table<DownloadPack>;
  mapTiles!: Table<MapTileRecord>;
  versionMeta!: Table<VersionRecord>;

  constructor() {
    super("TrekNepalDB");

    this.version(1).stores({
      routes: "id, name, region, difficulty",
      phrases: "id, category, english",
      emergencyContacts: "id, category, name",
      downloadedMaps: "id, type, routeId, status",
      mapTiles: "[routeId+z+x+y], routeId",
      versionMeta: "key",
    });
  }
}

export type MapTileRecord = {
  routeId: string;
  z: number;
  x: number;
  y: number;
  data: ArrayBuffer;
  contentType: string;
};

export type VersionRecord = {
  key: string;
  value: number | string;
  updatedAt: number;
};

// ─── Singleton Instance ───────────────────────────────────────────────────────

export const db = new TrekDatabase();

// ─── Initialization ───────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  try {
    await db.open();

    // Seed with base data if empty
    const routeCount = await db.routes.count();
    if (routeCount === 0) {
      await seedDatabase();
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
}

async function seedDatabase(): Promise<void> {
  const { everestRoute } = await import("../data/everest");
  const { annapurnaRoute } = await import("../data/annapurna");
  const { phrases } = await import("../data/phrases");
  const { emergencyContacts } = await import("../data/emergency");

  await db.transaction(
    "rw",
    [db.routes, db.phrases, db.emergencyContacts, db.versionMeta],
    async () => {
      await db.routes.bulkPut([everestRoute, annapurnaRoute]);
      await db.phrases.bulkPut(phrases);
      await db.emergencyContacts.bulkPut(emergencyContacts);
      await db.versionMeta.bulkPut([
        { key: "routes", value: 1, updatedAt: Date.now() },
        { key: "phrases", value: 1, updatedAt: Date.now() },
        { key: "emergency", value: 1, updatedAt: Date.now() },
      ]);
    },
  );
  console.log("✅ Database seeded with initial data");
}

// ─── Route Operations ─────────────────────────────────────────────────────────

export async function getAllRoutes(): Promise<TrekRoute[]> {
  return db.routes.toArray();
}

export async function getRouteById(id: string): Promise<TrekRoute | undefined> {
  return db.routes.get(id);
}

export async function updateRoutes(routes: TrekRoute[]): Promise<void> {
  await db.transaction("rw", [db.routes, db.versionMeta], async () => {
    await db.routes.bulkPut(routes);
    await db.versionMeta.put({
      key: "routes",
      value: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

// ─── Phrase Operations ────────────────────────────────────────────────────────

export async function getAllPhrases(): Promise<Phrase[]> {
  return db.phrases.toArray();
}

export async function getPhrasesByCategory(
  category: string,
): Promise<Phrase[]> {
  return db.phrases.where("category").equals(category).toArray();
}

export async function updatePhrases(phrases: Phrase[]): Promise<void> {
  await db.transaction("rw", [db.phrases, db.versionMeta], async () => {
    await db.phrases.bulkPut(phrases);
    await db.versionMeta.put({
      key: "phrases",
      value: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

// ─── Emergency Contact Operations ─────────────────────────────────────────────

export async function getAllEmergencyContacts(): Promise<EmergencyContact[]> {
  return db.emergencyContacts.toArray();
}

export async function getContactsByCategory(
  category: string,
): Promise<EmergencyContact[]> {
  return db.emergencyContacts.where("category").equals(category).toArray();
}

// ─── Map Tile Operations ──────────────────────────────────────────────────────

export async function saveMapTile(tile: MapTileRecord): Promise<void> {
  await db.mapTiles.put(tile);
}

export async function getMapTile(
  routeId: string,
  z: number,
  x: number,
  y: number,
): Promise<MapTileRecord | undefined> {
  return db.mapTiles.get({ routeId, z, x, y });
}

export async function deleteRouteMapTiles(routeId: string): Promise<void> {
  await db.mapTiles.where("routeId").equals(routeId).delete();
}

export async function countRouteMapTiles(routeId: string): Promise<number> {
  return db.mapTiles.where("routeId").equals(routeId).count();
}

// ─── Download Pack Operations ─────────────────────────────────────────────────

export async function getDownloadPacks(): Promise<DownloadPack[]> {
  return db.downloadedMaps.toArray();
}

export async function getDownloadPack(
  id: string,
): Promise<DownloadPack | undefined> {
  return db.downloadedMaps.get(id);
}

export async function upsertDownloadPack(pack: DownloadPack): Promise<void> {
  await db.downloadedMaps.put(pack);
}

export async function deleteDownloadPack(id: string): Promise<void> {
  await db.downloadedMaps.delete(id);
}

// ─── Storage Stats ────────────────────────────────────────────────────────────

export async function getStorageInfo(): Promise<{
  used: number;
  available: number;
  quota: number;
}> {
  try {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota ?? 0;
      const used = estimate.usage ?? 0;
      return { used, available: quota - used, quota };
    }
  } catch (err) {
    console.error("Failed to get storage info:", err);
  }
  return { used: 0, available: 0, quota: 0 };
}

export async function getVersionMeta(): Promise<
  Record<string, number | string>
> {
  const records = await db.versionMeta.toArray();
  return Object.fromEntries(records.map((r) => [r.key, r.value]));
}
