const Redis = require('ioredis');

let redisClient = null;
let isConnected = false;

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const REDIS_URL = process.env.REDIS_URL;

function createRedisClient() {
  if (redisClient) return redisClient;

  try {
    const options = {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy(times) {
        if (times > 3) {
          // If Redis is not running locally, stop aggressive retrying and fallback to in-memory mode
          return null;
        }
        return Math.min(times * 100, 2000);
      }
    };

    if (REDIS_PASSWORD) options.password = REDIS_PASSWORD;

    if (REDIS_URL) {
      redisClient = new Redis(REDIS_URL, options);
    } else {
      redisClient = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        ...options
      });
    }

    redisClient.on('connect', () => {
      isConnected = true;
      console.log('⚡ [Redis] Connected successfully to Redis Cache server');
    });

    redisClient.on('ready', () => {
      isConnected = true;
    });

    redisClient.on('error', (err) => {
      isConnected = false;
      // Graceful silence: When Redis server is not running on machine, app seamlessly falls back to RAM cache
      if (err.code !== 'ECONNREFUSED') {
        console.warn('⚠️ [Redis] Notice:', err.message);
      }
    });

    redisClient.on('close', () => {
      isConnected = false;
    });

    redisClient.on('end', () => {
      isConnected = false;
    });

  } catch (err) {
    isConnected = false;
    console.warn('⚠️ [Redis] Client initialization notice (using memory fallback):', err.message);
  }

  return redisClient;
}

function getRedisClient() {
  if (!redisClient) {
    createRedisClient();
  }
  return redisClient;
}

function isRedisReady() {
  return isConnected && redisClient && redisClient.status === 'ready';
}

// Auto-initialize client on module import
createRedisClient();

module.exports = {
  getRedisClient,
  isRedisReady
};
