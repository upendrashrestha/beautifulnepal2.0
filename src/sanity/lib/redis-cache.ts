import { Redis } from "@upstash/redis";

// Redis client
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
});

const SIX_HOURS = 6 * 60 * 60;

// Generic in-memory cache for server-side speed
const memoryCache = new Map<string, unknown>();

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false,
  ttlSeconds = SIX_HOURS
): Promise<T> {
  // 1️⃣ Check memory cache first
  if (!forceRefresh && memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  // 2️⃣ Check Redis if configured
  if (!forceRefresh && process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL) {
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      memoryCache.set(key, cached); // populate memory cache
      return cached;
    }
  }

  // 3️⃣ Fetch fresh data
  const data = await fetcher();

  // 4️⃣ Save to memory cache
  memoryCache.set(key, data);

  // 5️⃣ Save to Redis if available
  if (process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL) {
    try {
      await redis.set(key, data, { ex: ttlSeconds });
    } catch (err) {
      console.warn("Redis set failed", err);
    }
  }

  return data;
}

// Clear cache helper
export async function clearCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
    if (process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL) {
      await redis.del(key);
    }
  } else {
    memoryCache.clear();
    if (process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL) {
      await redis.flushall(); // ⚠️ clears all Redis
    }
  }
}
