/**
 * @packageDocumentation
 * Redis caching utilities for Oak SDK responses.
 *
 * @see {@link ./ttl-jitter} for cache stampede prevention via TTL jitter
 * @see {@link ./redis-connection} for Redis connection management
 * @see {@link ./cache-wrapper} for Result-aware caching with negative cache support
 */

export { createRedisClient, withRedisConnection } from './redis-connection';
export { calculateTtlWithJitter } from './ttl-jitter';
export {
  withCache,
  withCacheAndNegative,
  buildCacheKey,
  NOT_FOUND_SENTINEL,
  type CacheStats,
  type CacheOperations,
} from './cache-wrapper';
