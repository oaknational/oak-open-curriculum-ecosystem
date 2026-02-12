/* eslint-disable max-lines */
// TODO(future): Consider splitting cache helpers into separate files if this grows further
/**
 * Cache wrapper functions for SDK API responses with dependency injection.
 *
 * This module provides higher-order functions that add caching behavior to
 * Result-returning API functions. Two main wrappers are available:
 *
 * - {@link withCache}: Caches successful results only
 * - {@link withCacheAndNegative}: Also caches 404 responses (negative caching)
 *
 * ## Transcript Cache Categorization
 *
 * For transcript caching, use structured {@link TranscriptCacheEntry} from
 * `./transcript-cache-types` instead of the deprecated sentinel value.
 * This provides observability into WHY transcripts are unavailable.
 *
 * @see ADR-066 SDK Response Caching
 * @see ADR-078 Dependency Injection for Testability
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

import { ok, err, type Result } from '@oaknational/result';
import type {
  SdkFetchError,
  SdkNotFoundError,
  SdkLegallyRestrictedError,
} from '@oaknational/oak-curriculum-sdk';
import { cacheLogger } from '../../lib/logger';
import {
  deserializeTranscriptCacheEntry,
  serializeTranscriptCacheEntry,
} from './transcript-cache-types';

// =============================================================================
// Constants
// =============================================================================

/**
 * Cache key prefix with version for schema change invalidation.
 * Format: `oak-sdk:v1:{resourceType}:{id}`
 */
const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

/**
 * Statistics about cache usage during the current session.
 *
 * Track hits and misses to monitor cache effectiveness during ingestion.
 *
 * @example
 * ```typescript
 * const stats: CacheStats = { hits: 0, misses: 0 };
 * const cachedFn = withCache(fn, ops, 'prefix', 7, stats, guard, calc);
 * // After calls...
 * console.log(`Hit rate: ${stats.hits / (stats.hits + stats.misses)}`);
 * ```
 */
export interface CacheStats {
  /** Number of cache hits (value found in cache). */
  hits: number;
  /** Number of cache misses (value not in cache, fetched from API). */
  misses: number;
}

/**
 * Minimal cache operations interface for dependency injection.
 *
 * This abstraction allows testing cache logic without a real Redis connection.
 * Provide a Map-based fake for unit tests, or a real Redis client for production.
 *
 * @see ADR-078 Dependency Injection for Testability
 *
 * @example
 * ```typescript
 * // Production: Use Redis
 * const ops: CacheOperations = {
 *   get: (key) => redis.get(key),
 *   setex: (key, ttl, value) => redis.setex(key, ttl, value).then(() => {}),
 * };
 *
 * // Test: Use Map
 * const cache = new Map<string, string>();
 * const ops: CacheOperations = {
 *   get: async (key) => cache.get(key) ?? null,
 *   setex: async (key, _, value) => { cache.set(key, value); },
 * };
 * ```
 */
export interface CacheOperations {
  /**
   * Get a value from cache.
   * @param key - Cache key
   * @returns Cached value or null if not found
   */
  readonly get: (key: string) => Promise<string | null>;
  /**
   * Set a value with TTL.
   * @param key - Cache key
   * @param ttl - Time-to-live in seconds
   * @param value - Value to cache (JSON string)
   */
  readonly setex: (key: string, ttl: number, value: string) => Promise<void>;
}

// =============================================================================
// Cache Key Building
// =============================================================================

/**
 * Build a cache key from resource type and id.
 *
 * @param resourceType - Type of resource (e.g., 'lesson-summary', 'transcript')
 * @param id - Resource identifier (e.g., lesson slug)
 * @returns Fully qualified cache key
 */
export function buildCacheKey(resourceType: string, id: string): string {
  return `${CACHE_KEY_PREFIX}${resourceType}:${id}`;
}

// =============================================================================
// Cache Read/Write Helpers
// =============================================================================

async function tryReadCache<T>(
  ops: CacheOperations,
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T | null> {
  try {
    const cached = await ops.get(key);
    if (cached === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(cached);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function tryWriteCache(
  ops: CacheOperations,
  key: string,
  ttl: number,
  value: unknown,
): Promise<void> {
  try {
    await ops.setex(key, ttl, JSON.stringify(value));
  } catch {
    // Ignore cache write failures - caching is opportunistic
  }
}

async function tryWriteRaw(
  ops: CacheOperations,
  key: string,
  ttl: number,
  value: string,
): Promise<void> {
  try {
    await ops.setex(key, ttl, value);
  } catch {
    // Ignore cache write failures - caching is opportunistic
  }
}

async function tryReadRaw(ops: CacheOperations, key: string): Promise<string | null> {
  try {
    return await ops.get(key);
  } catch {
    return null;
  }
}

function createNotFoundError(id: string): SdkNotFoundError {
  return { kind: 'not_found', resource: id, resourceType: 'transcript' };
}

function createLegallyRestrictedError(id: string): SdkLegallyRestrictedError {
  return { kind: 'legally_restricted', resource: id, resourceType: 'transcript' };
}

// =============================================================================
// Cache Wrappers
// =============================================================================

/**
 * Wrap a Result-returning function with caching.
 *
 * Only caches successful (ok) results. Error results are not cached,
 * allowing retries on subsequent calls.
 *
 * @typeParam T - Type of the successful result value
 * @param fn - The underlying function to wrap
 * @param ops - Cache operations (get/setex)
 * @param cacheKeyPrefix - Prefix for cache keys (e.g., 'lesson-summary')
 * @param baseTtlDays - Base TTL in days (jitter is applied by calculator)
 * @param stats - Statistics object to track hits/misses
 * @param isValidCached - Type guard to validate cached values
 * @param ttlCalculator - Function to calculate TTL with jitter
 * @returns Wrapped function with caching behavior
 *
 * @example
 * ```typescript
 * const cachedGetSummary = withCache(
 *   getSummary,
 *   cacheOps,
 *   'lesson-summary',
 *   7, // 7 days
 *   stats,
 *   isLessonSummary,
 *   calculateTtlWithJitter
 * );
 * ```
 */
export function withCache<T>(
  fn: (id: string) => Promise<Result<T, SdkFetchError>>,
  ops: CacheOperations,
  cacheKeyPrefix: string,
  baseTtlDays: number,
  stats: CacheStats,
  isValidCached: (value: unknown) => value is T,
  ttlCalculator: (days: number) => number,
): (id: string) => Promise<Result<T, SdkFetchError>> {
  return async (id: string): Promise<Result<T, SdkFetchError>> => {
    const key = buildCacheKey(cacheKeyPrefix, id);
    const cached = await tryReadCache(ops, key, isValidCached);
    if (cached !== null) {
      stats.hits++;
      return ok(cached);
    }
    stats.misses++;
    const result = await fn(id);
    if (result.ok) {
      await tryWriteCache(ops, key, ttlCalculator(baseTtlDays), result.value);
    }
    return result;
  };
}

/** Result of handling cached negative entry - either a result to return or whether stats were updated. */
interface CachedNegativeResult<T> {
  readonly result: Result<T, SdkFetchError> | null;
  readonly statsUpdated: boolean;
}

/** Handle cached negative response (not_found, legally_restricted, or no_video). */
function handleCachedNegative<T>(
  rawCached: string,
  id: string,
  cacheKeyPrefix: string,
  ignoreCached404: boolean,
  stats: CacheStats,
): CachedNegativeResult<T> {
  const entry = deserializeTranscriptCacheEntry(rawCached);
  if (entry === null || entry.status === 'available') {
    return { result: null, statsUpdated: false };
  }
  // entry.status is 'not_found', 'legally_restricted', or 'no_video'
  if (ignoreCached404) {
    cacheLogger.debug(`Ignoring cached ${entry.status} (--ignore-cached-404)`, {
      cacheKeyPrefix,
      id,
    });
    stats.misses++;
    return { result: null, statsUpdated: true };
  }
  stats.hits++;
  cacheLogger.debug(`Negative cache hit (${entry.status})`, { cacheKeyPrefix, id });
  const error =
    entry.status === 'legally_restricted'
      ? createLegallyRestrictedError(id)
      : createNotFoundError(id);
  return { result: err(error), statsUpdated: true };
}

/** Try to parse and validate cached success value. */
function tryParseCachedValue<T>(
  rawCached: string,
  isValidCached: (value: unknown) => value is T,
  stats: CacheStats,
): Result<T, SdkFetchError> | null {
  try {
    const parsed: unknown = JSON.parse(rawCached);
    if (isValidCached(parsed)) {
      stats.hits++;
      return ok(parsed);
    }
  } catch {
    // Invalid JSON, treat as cache miss
  }
  return null;
}

/** Store result to cache, including negative caching for 404s and 451s. */
async function storeResultToCache<T>(
  result: Result<T, SdkFetchError>,
  ops: CacheOperations,
  key: string,
  ttl: number,
  cacheKeyPrefix: string,
  id: string,
): Promise<void> {
  if (result.ok) {
    await tryWriteCache(ops, key, ttl, result.value);
  } else if (result.error.kind === 'not_found') {
    cacheLogger.debug('Caching 404 response', { cacheKeyPrefix, id, ttl });
    await tryWriteRaw(ops, key, ttl, serializeTranscriptCacheEntry({ status: 'not_found' }));
  } else if (result.error.kind === 'legally_restricted') {
    cacheLogger.debug('Caching 451 response', { cacheKeyPrefix, id, ttl });
    await tryWriteRaw(
      ops,
      key,
      ttl,
      serializeTranscriptCacheEntry({ status: 'legally_restricted' }),
    );
  }
}

/**
 * Wrap with caching including negative caching for 404 responses.
 *
 * Used for resources where many legitimately don't exist, such as transcripts
 * for lessons without videos. Caching 404s prevents repeated API calls for
 * known-missing resources.
 *
 * ## Transcript Caching Note
 *
 * For transcript caching, consider using structured {@link TranscriptCacheEntry}
 * format with a type guard that accepts all status variants. This provides
 * better observability into WHY transcripts are unavailable.
 *
 * @typeParam T - Type of the successful result value
 * @param fn - The underlying function to wrap
 * @param ops - Cache operations (get/setex)
 * @param cacheKeyPrefix - Prefix for cache keys (e.g., 'transcript')
 * @param baseTtlDays - Base TTL in days (jitter is applied by calculator)
 * @param stats - Statistics object to track hits/misses
 * @param isValidCached - Type guard to validate cached values
 * @param ignoreCached404 - If true, bypass cached 404s and re-fetch (--ignore-cached-404 flag)
 * @param ttlCalculator - Function to calculate TTL with jitter
 * @returns Wrapped function with caching and negative caching behavior
 *
 * @see ADR-092 Transcript Cache Categorization Strategy
 *
 * @example
 * ```typescript
 * const cachedGetTranscript = withCacheAndNegative(
 *   getTranscript,
 *   cacheOps,
 *   'transcript',
 *   7, // 7 days
 *   stats,
 *   isTranscriptCacheEntry, // From transcript-cache-types
 *   false, // Don't ignore cached 404s
 *   calculateTtlWithJitter
 * );
 * ```
 */
export function withCacheAndNegative<T>(
  fn: (id: string) => Promise<Result<T, SdkFetchError>>,
  ops: CacheOperations,
  cacheKeyPrefix: string,
  baseTtlDays: number,
  stats: CacheStats,
  isValidCached: (value: unknown) => value is T,
  ignoreCached404: boolean,
  ttlCalculator: (days: number) => number,
): (id: string) => Promise<Result<T, SdkFetchError>> {
  return async (id: string): Promise<Result<T, SdkFetchError>> => {
    const key = buildCacheKey(cacheKeyPrefix, id);
    const rawCached = await tryReadRaw(ops, key);

    let statsUpdated = false;
    if (rawCached !== null) {
      const cached404 = handleCachedNegative<T>(
        rawCached,
        id,
        cacheKeyPrefix,
        ignoreCached404,
        stats,
      );
      if (cached404.result !== null) {
        return cached404.result;
      }
      statsUpdated = cached404.statsUpdated;

      const parsedResult = tryParseCachedValue(rawCached, isValidCached, stats);
      if (parsedResult !== null) {
        return parsedResult;
      }
    }

    if (!statsUpdated) {
      stats.misses++;
    }
    const result = await fn(id);
    await storeResultToCache(result, ops, key, ttlCalculator(baseTtlDays), cacheKeyPrefix, id);
    return result;
  };
}
