/**
 * Lightweight Client-Side In-Memory Cache & In-Flight Request Deduplicator
 * - Prevents duplicate simultaneous requests by reusing in-flight promises
 * - Caches stable read data (navbar, banners, categories, collections, pricing) with TTL
 */

const cache = new Map();
const inFlightPromises = new Map();

/**
 * Cached and deduplicated fetch wrapper
 * @param {string} url 
 * @param {RequestInit} [options] 
 * @param {number} [ttlMs=180000] Default 3 minutes TTL
 * @returns {Promise<any>}
 */
export async function cachedFetch(url, options = {}, ttlMs = 180000) {
  const method = (options.method || 'GET').toUpperCase();

  // Only GET requests are safe to cache and deduplicate
  if (method !== 'GET') {
    const res = await fetch(url, options);
    return res.json();
  }

  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expiry > now) {
    return Promise.resolve(cached.data);
  }

  // If identical request is already in-flight, return the existing promise!
  if (inFlightPromises.has(url)) {
    return inFlightPromises.get(url);
  }

  const fetchPromise = fetch(url, options)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      cache.set(url, { data, expiry: Date.now() + ttlMs });
      inFlightPromises.delete(url);
      return data;
    })
    .catch((err) => {
      inFlightPromises.delete(url);
      throw err;
    });

  inFlightPromises.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Clear cache for specific key or pattern
 * @param {string|RegExp} [keyOrPattern]
 */
export function invalidateClientCache(keyOrPattern) {
  if (!keyOrPattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (typeof keyOrPattern === 'string' && key.includes(keyOrPattern)) {
      cache.delete(key);
    } else if (keyOrPattern instanceof RegExp && keyOrPattern.test(key)) {
      cache.delete(key);
    }
  }
}
