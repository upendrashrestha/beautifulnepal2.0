// lib/sanity/cache.ts

const cache = new Map<string, Promise<any>>();

/**
 * Fetch data with caching. Use `forceRefresh = true` to bypass cache.
 */
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh: boolean = false
): Promise<T> {
  if (forceRefresh || !cache.has(key)) {
    const result = fetcher();
    cache.set(key, result);
  }
  return cache.get(key)!;
}

/**
 * Manually clear one or all cached entries
 */
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
