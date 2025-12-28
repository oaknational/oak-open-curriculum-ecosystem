/**
 * Redis-cached wrapper for Oak SDK. All methods return Result<T, SdkFetchError> per ADR-088.
 * @see ADR-066 (caching), ADR-088 (Result pattern)
 */

import type Redis from 'ioredis';
import type { OakClient } from './oak-adapter-sdk';
import { createOakSdkClient } from './oak-adapter-sdk';
import { optionalEnv } from '../lib/env';
import { cacheLogger } from '../lib/logger';
import { createRedisClient, withRedisConnection } from './sdk-cache/redis-connection';
import { calculateTtlWithJitter } from './sdk-cache/ttl-jitter';
import { isLessonSummary, isUnitSummary } from '../types/oak';
import { isTranscriptResponse } from './sdk-guards';
import { ok, type Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/oak-curriculum-sdk';

/** Cache key prefix with version for schema change invalidation. */
const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

/** Statistics about cache usage during the current session. */
export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly connected: boolean;
}

/** Extended Oak client interface with cache management capabilities. */
export interface CachedOakClient extends OakClient {
  getCacheStats(): CacheStats;
  disconnect(): Promise<void>;
}

/** Build a cache key for a resource. */
function buildCacheKey(resourceType: string, id: string): string {
  return `${CACHE_KEY_PREFIX}${resourceType}:${id}`;
}

/** Create an uncached client wrapper with no-op cache methods. */
function createUncachedClient(baseClient: OakClient): CachedOakClient {
  return {
    ...baseClient,
    getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
    disconnect: () => Promise.resolve(),
  };
}

/** Parse trusted cache content. */
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

/** Try to read from cache, returns null on miss or error. */
async function tryReadCache<T>(
  redis: Redis,
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (cached === null) {
      return null;
    }
    const parsed = parseJson(cached);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Try to write to cache, ignores errors. */
async function tryWriteCache(
  redis: Redis,
  key: string,
  ttl: number,
  value: unknown,
): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    /* ignore cache write failures */
  }
}

/** Wrap a Result-returning function with caching. Only caches ok results. */
function withCacheResult<T>(
  fn: (id: string) => Promise<Result<T, SdkFetchError>>,
  redis: Redis,
  resourceType: string,
  baseTtlDays: number,
  stats: { hits: number; misses: number },
  isValidCached: (value: unknown) => value is T,
): (id: string) => Promise<Result<T, SdkFetchError>> {
  return async (id: string): Promise<Result<T, SdkFetchError>> => {
    const key = buildCacheKey(resourceType, id);
    const cached = await tryReadCache(redis, key, isValidCached);
    if (cached !== null) {
      stats.hits++;
      return ok(cached);
    }
    stats.misses++;
    const result = await fn(id);
    // Only cache successful results - errors should not be cached
    if (result.ok) {
      const ttlWithJitter = calculateTtlWithJitter(baseTtlDays);
      await tryWriteCache(redis, key, ttlWithJitter, result.value);
    }
    return result;
  };
}

/** Create cached client wrapper. Result errors pass through uncached. */
function createCachedClientWrapper(
  baseClient: OakClient,
  redis: Redis,
  baseTtlDays: number,
  stats: { hits: number; misses: number },
): CachedOakClient {
  return {
    // Pass through methods that don't need caching (listing endpoints)
    getUnitsByKeyStageAndSubject: baseClient.getUnitsByKeyStageAndSubject,
    getSubjectSequences: baseClient.getSubjectSequences,
    getSequenceUnits: baseClient.getSequenceUnits,
    getAllThreads: baseClient.getAllThreads,
    getThreadUnits: baseClient.getThreadUnits,
    getLessonsByKeyStageAndSubject: baseClient.getLessonsByKeyStageAndSubject,
    rateLimitTracker: baseClient.rateLimitTracker,

    // Cached Result-returning methods
    getUnitSummary: withCacheResult(
      baseClient.getUnitSummary,
      redis,
      'unit-summary',
      baseTtlDays,
      stats,
      isUnitSummary,
    ),
    getLessonSummary: withCacheResult(
      baseClient.getLessonSummary,
      redis,
      'lesson-summary',
      baseTtlDays,
      stats,
      isLessonSummary,
    ),
    getLessonTranscript: withCacheResult(
      baseClient.getLessonTranscript,
      redis,
      'lesson-transcript',
      baseTtlDays,
      stats,
      isTranscriptResponse,
    ),

    // Cache management methods
    getCacheStats: () => ({ hits: stats.hits, misses: stats.misses, connected: true }),
    disconnect: async () => {
      await redis.quit();
      cacheLogger.info('Disconnected from Redis');
    },
  };
}

/** Create a cached Oak SDK client. Falls back to uncached if Redis unavailable. */
export async function createCachedOakSdkClient(): Promise<CachedOakClient> {
  const baseClient = createOakSdkClient();
  const config = optionalEnv();

  if (!config?.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching disabled');
    return createUncachedClient(baseClient);
  }

  const redis = await createRedisClient(config.SDK_CACHE_REDIS_URL);
  if (!redis) {
    return createUncachedClient(baseClient);
  }

  const stats = { hits: 0, misses: 0 };
  cacheLogger.info('SDK caching enabled', { ttlDays: config.SDK_CACHE_TTL_DAYS });

  return createCachedClientWrapper(baseClient, redis, config.SDK_CACHE_TTL_DAYS, stats);
}

/** Clear all cached SDK responses from Redis. */
export async function clearSdkCache(): Promise<number> {
  const config = optionalEnv();
  if (!config?.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching not enabled, nothing to clear');
    return 0;
  }

  return withRedisConnection(config.SDK_CACHE_REDIS_URL, 0, async (redis) => {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    if (keys.length === 0) {
      cacheLogger.info('No cached entries to clear');
      return 0;
    }
    const deleted = await redis.del(...keys);
    cacheLogger.info('Cleared cached entries', { count: deleted });
    return deleted;
  });
}

/** SDK cache status result. */
interface CacheStatus {
  enabled: boolean;
  connected: boolean;
  keyCount: number;
}

/** Check SDK cache status without creating a full client. */
export async function getSdkCacheStatus(): Promise<CacheStatus> {
  const config = optionalEnv();
  if (!config?.SDK_CACHE_ENABLED) {
    return { enabled: false, connected: false, keyCount: 0 };
  }

  const disconnectedFallback: CacheStatus = { enabled: true, connected: false, keyCount: 0 };

  return withRedisConnection(config.SDK_CACHE_REDIS_URL, disconnectedFallback, async (redis) => {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    return { enabled: true, connected: true, keyCount: keys.length };
  });
}
