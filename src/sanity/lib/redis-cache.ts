import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
});

const SIX_HOURS = 6 * 60 * 60;

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false,
  ttlSeconds = SIX_HOURS
): Promise<T> {
  if (!forceRefresh) {
    const cached = await redis.get<T>(key);
    if (cached) {
      return cached;
    }
  }

  const data = await fetcher();
  await redis.set(key, data, { ex: ttlSeconds });
  return data;
}

export async function clearCache(key?: string) {
  if (key) {
    await redis.del(key);
  } else {
    await redis.flushall(); // Be cautious: this clears all cache
  }
}
