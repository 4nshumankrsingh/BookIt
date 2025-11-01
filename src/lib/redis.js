import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cache keys with TTL (in seconds)
const CACHE_TTL = {
  FLIGHT_SEARCH: 15 * 60, // 15 minutes
  AIRPORT_DETAILS: 24 * 60 * 60, // 24 hours
  AIRPORT_SEARCH: 6 * 60 * 60, // 6 hours
  FLIGHT_STATUS: 10 * 60, // 10 minutes
  NEARBY_AIRPORTS: 12 * 60 * 60, // 12 hours
  EXPERIENCE_FLIGHTS: 30 * 60, // 30 minutes
};

// Cache key generators
const cacheKeys = {
  flightSearch: (from, to, date) => `flight_search:${from}:${to}:${date}`,
  airportDetails: (code) => `airport:${code}`,
  airportSearch: (query) => `airport_search:${Buffer.from(query).toString('base64')}`,
  airportSearchByLocation: (lat, lon, radius) => `airport_location:${lat}:${lon}:${radius}`,
  flightStatus: (flightNumber, date) => `flight_status:${flightNumber}:${date}`,
  nearbyAirports: (lat, lon, radius) => `nearby_airports:${lat}:${lon}:${radius}`,
  experienceFlights: (experienceId, from, date) => `exp_flights:${experienceId}:${from}:${date}`,
};

// Redis utility functions
export const redisCache = {
  // Get cached data
  async get(key) {
    try {
      const data = await redis.get(key);
      if (data) {
        console.log(`Cache hit: ${key}`);
        return data;
      }
      console.log(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  // Set cached data with TTL
  async set(key, data, ttl) {
    try {
      await redis.set(key, data, { ex: ttl });
      console.log(`Cache set: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  // Delete cached data
  async del(key) {
    try {
      await redis.del(key);
      console.log(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  },

  // Get cached data with fallback function
  async withCache(key, fallbackFunction, ttl) {
    try {
      // Try to get from cache first
      const cached = await this.get(key);
      if (cached) {
        return cached;
      }

      // Execute fallback function if cache miss
      const freshData = await fallbackFunction();
      
      // Cache the result
      if (freshData) {
        await this.set(key, freshData, ttl);
      }
      
      return freshData;
    } catch (error) {
      console.error('Cache with fallback error:', error);
      // If cache fails, still try to get fresh data
      return await fallbackFunction();
    }
  },

  // Batch cache operations
  async mget(keys) {
    try {
      return await redis.mget(...keys);
    } catch (error) {
      console.error('Redis mget error:', error);
      return keys.map(() => null);
    }
  },

  // Invalidate related cache keys (pattern matching)
  async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Invalidated ${keys.length} keys with pattern: ${pattern}`);
      }
      return keys.length;
    } catch (error) {
      console.error('Redis invalidate pattern error:', error);
      return 0;
    }
  },

  // Health check
  async health() {
    try {
      await redis.ping();
      return { status: 'healthy', provider: 'Upstash Redis' };
    } catch (error) {
      console.error('Redis health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }
};

// Export cache keys and TTL for use in other files
export { cacheKeys, CACHE_TTL };

export default redisCache;