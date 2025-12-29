/**
 * Cache wrapper functions for SDK API responses with dependency injection.
 * @see ADR-066 (caching), ADR-078 (dependency injection)
 * @packageDocumentation
 */

import { ok, err, type Result } from '@oaknational/result';
import type { SdkFetchError, SdkNotFoundError } from '@oaknational/oak-curriculum-sdk';
import { cacheLogger } from '../../lib/logger';

// =============================================================================
// Types
// =============================================================================

/** Cache key prefix with version for schema change invalidation. */
const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

/**
 * Sentinel value for cached 404 responses (negative caching).
 * @see https://en.wikipedia.org/wiki/Negative_cache
 */
export const NOT_FOUND_SENTINEL = '__NOT_FOUND__';

/** Statistics about cache usage during the current session. */
export interface CacheStats {
  hits: number;
  misses: number;
}

/**
 * Minimal cache operations interface for dependency injection.
 * This allows testing without a real Redis connection.
 */
export interface CacheOperations {
  /** Get a value from cache, returns null if not found. */
  readonly get: (key: string) => Promise<string | null>;
  /** Set a value with TTL in seconds. */
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

// =============================================================================
// Cache Wrappers
// =============================================================================

/**
 * Wrap a Result-returning function with caching. Only caches ok results.
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

/** Result of handling cached 404 - either a result to return or whether stats were updated. */
interface Cached404Result<T> {
  readonly result: Result<T, SdkFetchError> | null;
  readonly statsUpdated: boolean;
}

/** Handle cached 404 response. Returns result if handled, or whether stats were updated. */
function handleCached404<T>(
  rawCached: string,
  id: string,
  cacheKeyPrefix: string,
  ignoreCached404: boolean,
  stats: CacheStats,
): Cached404Result<T> {
  if (rawCached !== NOT_FOUND_SENTINEL) {
    return { result: null, statsUpdated: false };
  }
  if (ignoreCached404) {
    cacheLogger.debug('Ignoring cached 404 (--ignore-cached-404)', { cacheKeyPrefix, id });
    stats.misses++;
    return { result: null, statsUpdated: true };
  }
  stats.hits++;
  cacheLogger.debug('Negative cache hit (404)', { cacheKeyPrefix, id });
  return { result: err(createNotFoundError(id)), statsUpdated: true };
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

/** Store result to cache, including negative caching for 404s. */
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
    await tryWriteRaw(ops, key, ttl, NOT_FOUND_SENTINEL);
  }
}

/**
 * Wrap with caching including negative caching for 404s.
 * Used for transcripts where many legitimately don't exist.
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
      const cached404 = handleCached404<T>(rawCached, id, cacheKeyPrefix, ignoreCached404, stats);
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
