/**
 * Ultra-fast In-Memory Micro-Cache Manager with TTL and Prefix Invalidation
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get a cached value by key if not expired
   * @param {string} key
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Store a value in cache with a TTL (in milliseconds)
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs Default 3 minutes (180000ms)
   */
  set(key, value, ttlMs = 180000) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  /**
   * Delete a specific key
   * @param {string} key
   */
  del(key) {
    this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix string or regular expression
   * @param {string|RegExp} pattern
   */
  delByPrefix(pattern) {
    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string') {
        if (key.startsWith(pattern)) {
          this.cache.delete(key);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Clear the entire cache
   */
  flush() {
    this.cache.clear();
  }
}

const cacheManager = new CacheManager();
module.exports = cacheManager;
