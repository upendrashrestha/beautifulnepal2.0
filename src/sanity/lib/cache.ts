// lib/sanity/cache.ts

/**
 * Generic cache map scoped to type T.
 * NOTE: You can also use a WeakMap if needed per instance.
 */
const cache = new Map<string, Promise<unknown>>();

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

  // Type assertion is safe because the cache is only populated through the typed fetcher.
  return cache.get(key)! as Promise<T>;
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
