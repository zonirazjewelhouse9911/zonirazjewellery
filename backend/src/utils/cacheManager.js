/**
 * Ultra-fast Hybrid Redis & In-Memory Micro-Cache Manager
 * - Primary Layer: Redis (Distributed & Cluster-safe)
 * - Fallback Layer: In-Memory Map with TTL (Zero-downtime if Redis is offline)
 */

const { getRedisClient, isRedisReady } = require('../config/redis');

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.prefix = 'zoniraz:';
  }

  _getKey(key) {
    return key.startsWith(this.prefix) ? key : `${this.prefix}${key}`;
  }

  /**
   * Get a cached value by key
   * @param {string} key
   * @returns {Promise<any>}
   */
  async get(key) {
    const fullKey = this._getKey(key);

    // 1. Try Redis primary cache if ready
    if (isRedisReady()) {
      try {
        const redis = getRedisClient();
        const raw = await redis.get(fullKey);
        if (raw !== null && raw !== undefined) {
          try {
            const parsed = JSON.parse(raw);
            // Sync to local memory L1 cache for instant sub-microsecond access
            this.memoryCache.set(key, {
              value: parsed,
              expiry: Date.now() + 60000 // 1 min local mirror
            });
            return parsed;
          } catch (parseErr) {
            return raw;
          }
        }
      } catch (err) {
        // Silently fall through to memory cache on Redis error
      }
    }

    // 2. Fallback to in-memory cache
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.memoryCache.delete(key);
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
  async set(key, value, ttlMs = 180000) {
    const fullKey = this._getKey(key);
    const ttlSeconds = Math.max(1, Math.ceil(ttlMs / 1000));

    // 1. Store in local in-memory fallback
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });

    // 2. Store in Redis if ready
    if (isRedisReady()) {
      try {
        const redis = getRedisClient();
        const serialized = JSON.stringify(value);
        await redis.set(fullKey, serialized, 'EX', ttlSeconds);
      } catch (err) {
        // Log notice if needed without breaking response
      }
    }
  }

  /**
   * Delete a specific key from cache
   * @param {string} key
   */
  async del(key) {
    const fullKey = this._getKey(key);
    this.memoryCache.delete(key);

    if (isRedisReady()) {
      try {
        const redis = getRedisClient();
        await redis.del(fullKey);
      } catch (err) {
        // Silently handle
      }
    }
  }

  /**
   * Invalidate all keys matching a prefix string or pattern
   * @param {string|RegExp} pattern
   */
  async delByPrefix(pattern) {
    // 1. Purge from Memory Cache
    for (const key of this.memoryCache.keys()) {
      if (typeof pattern === 'string') {
        if (key.startsWith(pattern)) {
          this.memoryCache.delete(key);
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(key)) {
          this.memoryCache.delete(key);
        }
      }
    }

    // 2. Purge from Redis Cache if ready
    if (isRedisReady() && typeof pattern === 'string') {
      try {
        const redis = getRedisClient();
        const patternToScan = `${this.prefix}${pattern}*`;
        const stream = redis.scanStream({ match: patternToScan, count: 50 });

        stream.on('data', async (keys) => {
          if (keys && keys.length > 0) {
            const pipeline = redis.pipeline();
            keys.forEach((k) => pipeline.del(k));
            await pipeline.exec();
          }
        });
      } catch (err) {
        // Silently handle
      }
    }
  }

  /**
   * Clear the entire cache
   */
  async flush() {
    this.memoryCache.clear();
    if (isRedisReady()) {
      try {
        const redis = getRedisClient();
        await redis.flushdb();
      } catch (err) {
        // Silently handle
      }
    }
  }
}

const cacheManager = new CacheManager();
module.exports = cacheManager;
