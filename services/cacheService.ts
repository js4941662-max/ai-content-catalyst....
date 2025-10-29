interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// A simple in-memory cache with a Time-To-Live (TTL) to avoid stale data.
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export const apiCache = {
  /**
   * Stores a value in the cache.
   * @param key A unique key for the cache entry.
   * @param data The data to be stored.
   */
  set<T>(key: string, data: T): void {
    console.log(`Caching result for key: ${key}`);
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  /**
   * Retrieves a value from the cache. Returns null if the entry
   * does not exist or has expired.
   * @param key The key of the item to retrieve.
   */
  get<T>(key: string): T | null {
    const entry = cache.get(key);

    if (!entry) {
      console.log(`Cache miss for key: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    if (isExpired) {
      console.log(`Cache expired for key: ${key}`);
      cache.delete(key);
      return null;
    }

    console.log(`Cache hit for key: ${key}`);
    return entry.data as T;
  },
  
  /**
   * Generates a simple, non-cryptographic hash from a string to use as a cache key.
   * This is used to create a consistent key from a potentially large text input.
   * @param prefix A prefix to avoid key collisions between different types of API calls.
   * @param input The string input to hash.
   */
  generateKey(prefix: string, input: string): string {
    let hash = 0;
    if (input.length === 0) return `${prefix}:${hash}`;
    
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return `${prefix}:${hash}`;
  }
};
