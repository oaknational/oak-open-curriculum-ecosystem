/**
 * Redis caching utilities for Oak SDK responses.
 *
 * This module provides caching infrastructure for the Oak curriculum API client,
 * including TTL jitter for cache stampede prevention, Redis connection management,
 * and Result-aware caching with negative cache support.
 *
 * ## Transcript Cache Categorization
 *
 * For transcript caching, use the structured `TranscriptCacheEntry` format
 * which provides observability into WHY transcripts are unavailable.
 *
 * @see `./ttl-jitter` for cache stampede prevention via TTL jitter
 * @see `./redis-connection` for Redis connection management
 * @see `./cache-wrapper` for Result-aware caching with negative cache support
 * @see `./transcript-cache-types` for structured transcript cache entries
 * @see ADR-066 SDK Response Caching
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

export { createRedisClient, withRedisConnection } from './redis-connection';
export { calculateTtlWithJitter } from './ttl-jitter';
export { withCache, withCacheAndNegative, type CacheOperations } from './cache-wrapper';
