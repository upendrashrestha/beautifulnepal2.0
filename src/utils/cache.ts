interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class CacheManager {
  private prefix = "goothi_cache_";

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  set<T>(key: string, data: T, ttlMinutes = 60): void {
    if (!this.isBrowser()) return;

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };

    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser()) return null;

    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;

      if (isExpired) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  remove(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  clear(): void {
    if (!this.isBrowser()) return;

    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const cacheManager = new CacheManager();
