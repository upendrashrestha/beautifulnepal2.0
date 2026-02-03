// utils/cache.ts
import { Redis } from "@upstash/redis";

const redis = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
      token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const SIX_HOURS = 6 * 60 * 60;

// Per-instance memory cache (important!)
const memoryCache = new Map<string, unknown>();

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false,
  ttlSeconds = SIX_HOURS,
): Promise<T> {
  // 1️⃣ Memory cache
  if (!forceRefresh && memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // 2️⃣ Redis cache
  if (!forceRefresh && redis) {
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      memoryCache.set(key, cached);
      return cached;
    }
  }

  // 3️⃣ Fetch fresh
  const data = await fetcher();

  // 4️⃣ Store in memory
  memoryCache.set(key, data);

  // 5️⃣ Store in Redis
  if (redis) {
    try {
      await redis.set(key, data, { ex: ttlSeconds });
    } catch (err) {
      console.warn("Redis set failed", err);
    }
  }

  return data;
}

export async function clearCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
    if (redis) await redis.del(key);
  } else {
    memoryCache.clear();
    if (redis) await redis.flushall();
  }
}
