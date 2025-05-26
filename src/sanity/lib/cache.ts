// lib/sanity/cache.ts

const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

type CacheEntry<T> = {
  timestamp: number;
  data: Promise<T>;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh: boolean = false
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  const isExpired = entry ? now - entry.timestamp > SIX_HOURS : true;

  if (forceRefresh || !entry || isExpired) {
    const data = fetcher();
    cache.set(key, {
      data,
      timestamp: now,
    });
    return data;
  }

  return entry.data;
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
