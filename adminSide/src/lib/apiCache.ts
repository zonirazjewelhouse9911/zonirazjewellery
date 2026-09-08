/**
 * Lightweight in-memory client-side cache and request deduplicator for Zoniraj Admin Panel.
 * Provides in-flight Promise deduplication, TTL expiration, and granular cache invalidation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightPromises = new Map<string, Promise<any>>();

export interface CachedFetchOptions extends RequestInit {
  ttlMs?: number;
  forceRefresh?: boolean;
}

/**
 * Executes an HTTP fetch request with in-memory caching and in-flight request deduplication.
 * Only GET requests are cached.
 * 
 * @param url The resource URL
 * @param options Request options including optional ttlMs and forceRefresh
 * @returns Parsed JSON response
 */
export async function cachedFetch<T = any>(
  url: string,
  options?: CachedFetchOptions
): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const ttlMs = options?.ttlMs ?? 60000; // 60s default TTL
  const forceRefresh = options?.forceRefresh ?? false;

  // Only cache and deduplicate GET requests
  if (method !== 'GET') {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP ${res.status}`);
    }
    return await res.json();
  }

  const now = Date.now();

  // 1. Check valid cache entry (if not forcing fresh data)
  if (!forceRefresh) {
    const cached = memoryCache.get(url);
    if (cached && (now - cached.timestamp < ttlMs)) {
      return cached.data as T;
    }
  }

  // 2. Check in-flight promise for deduplication
  if (!forceRefresh && inFlightPromises.has(url)) {
    return inFlightPromises.get(url) as Promise<T>;
  }

  // 3. Initiate fetch and register in-flight promise
  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      // Cache successful response only
      if (data && data.success !== false) {
        memoryCache.set(url, { data, timestamp: Date.now() });
      }
      return data as T;
    } finally {
      inFlightPromises.delete(url);
    }
  })();

  inFlightPromises.set(url, promise);
  return promise;
}

/**
 * Invalidates cache entries matching a pattern string or regex.
 * If no pattern is provided, clears the entire cache.
 * 
 * @param pattern Optional string or RegExp to match against cache keys
 */
export function invalidateCache(pattern?: string | RegExp): void {
  if (!pattern) {
    memoryCache.clear();
    return;
  }

  for (const key of memoryCache.keys()) {
    const isMatch = typeof pattern === 'string' 
      ? key.includes(pattern) 
      : pattern.test(key);

    if (isMatch) {
      memoryCache.delete(key);
    }
  }
}
