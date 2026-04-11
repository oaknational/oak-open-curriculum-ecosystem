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

import { ok, type Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/curriculum-sdk';
import {
  handleCachedNegative,
  storeResultToCache,
  tryParseCachedValue,
  tryReadCache,
  tryReadRaw,
  tryWriteCache,
} from './cache-wrapper-internals';
import type { CacheOperations, CacheStats } from './cache-wrapper-types';

export type { CacheOperations, CacheStats } from './cache-wrapper-types';

const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

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
