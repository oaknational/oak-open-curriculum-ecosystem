/**
 * @module oak-adapter-cached
 * @description Redis-cached wrapper for the Oak SDK client. Provides optional,
 * persistent caching for Oak API responses during ingestion.
 * @see {@link ../../docs/SDK-CACHING.md} for documentation
 * @see {@link ../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md} for ADR
 */

import Redis from 'ioredis';
import type { OakClient } from './oak-adapter-sdk';
import { createOakSdkClient } from './oak-adapter-sdk';
import { optionalEnv } from '../lib/env';
import { cacheLogger } from '../lib/logger';

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

/** Create Redis client with error handling, returns null if unavailable. */
async function createRedisClient(url: string): Promise<Redis | null> {
  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
      lazyConnect: true,
    });
    await client.connect();
    await client.ping();
    cacheLogger.info('Connected to Redis', { url });
    return client;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    cacheLogger.warn('Redis connection failed, continuing without cache', { error: msg });
    return null;
  }
}

/** Try to read from cache, returns null on miss or error. */
async function tryReadCache<T>(redis: Redis, key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    return cached !== null ? (JSON.parse(cached) as T) : null;
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

/**
 * Wrap function with caching + 404 fallback. Caches both successes AND 404 errors
 * as fallback values, ensuring 100% cache hits on subsequent runs. Essential for
 * optional resources like transcripts (many lessons have no video).
 */
function withCacheAndFallback<T>(
  fn: (id: string) => Promise<T>,
  redis: Redis,
  resourceType: string,
  ttlSeconds: number,
  stats: { hits: number; misses: number },
  fallback: T,
): (id: string) => Promise<T> {
  return async (id: string): Promise<T> => {
    const key = buildCacheKey(resourceType, id);
    const cached = await tryReadCache<T>(redis, key);
    if (cached !== null) {
      stats.hits++;
      return cached;
    }
    stats.misses++;
    try {
      const result = await fn(id);
      await tryWriteCache(redis, key, ttlSeconds, result);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        await tryWriteCache(redis, key, ttlSeconds, fallback);
        return fallback;
      }
      throw error;
    }
  };
}

function createCachedClientWrapper(
  baseClient: OakClient,
  redis: Redis,
  ttlSeconds: number,
  stats: { hits: number; misses: number },
): CachedOakClient {
  return {
    getUnitsByKeyStageAndSubject: baseClient.getUnitsByKeyStageAndSubject,
    getLessonsByKeyStageAndSubject: baseClient.getLessonsByKeyStageAndSubject,
    getSubjectSequences: baseClient.getSubjectSequences,
    getSequenceUnits: baseClient.getSequenceUnits,
    // Unit summaries use fallback caching - some units in listings don't have
    // full summary data, returning 404. We cache null to avoid repeated network calls.
    getUnitSummary: withCacheAndFallback(
      baseClient.getUnitSummary,
      redis,
      'unit-summary',
      ttlSeconds,
      stats,
      null, // Fallback for 404s (unit exists in listing but no summary data)
    ),
    // Lesson summaries use fallback caching - some lessons in listings don't have
    // full summary data, returning 404. We cache null to avoid repeated network calls.
    getLessonSummary: withCacheAndFallback(
      baseClient.getLessonSummary,
      redis,
      'lesson-summary',
      ttlSeconds,
      stats,
      null, // Fallback for 404s (lesson exists in listing but no summary data)
    ),
    // Transcripts use fallback caching - many lessons don't have video/transcripts,
    // returning 404. We cache the empty fallback to avoid repeated network calls.
    getLessonTranscript: withCacheAndFallback(
      baseClient.getLessonTranscript,
      redis,
      'lesson-transcript',
      ttlSeconds,
      stats,
      { transcript: '', vtt: '' }, // Fallback for 404s (no video/transcript)
    ),
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

  // If env not available or caching disabled, return uncached client
  if (!config?.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching disabled');
    return createUncachedClient(baseClient);
  }

  const redis = await createRedisClient(config.SDK_CACHE_REDIS_URL);
  if (!redis) {
    return createUncachedClient(baseClient);
  }

  const ttlSeconds = config.SDK_CACHE_TTL_DAYS * 24 * 60 * 60;
  const stats = { hits: 0, misses: 0 };
  cacheLogger.info('SDK caching enabled', { ttlDays: config.SDK_CACHE_TTL_DAYS });

  return createCachedClientWrapper(baseClient, redis, ttlSeconds, stats);
}

/** Clear all cached SDK responses from Redis. */
export async function clearSdkCache(): Promise<number> {
  const config = optionalEnv();
  if (!config?.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching not enabled, nothing to clear');
    return 0;
  }

  const redis = await createRedisClient(config.SDK_CACHE_REDIS_URL);
  if (!redis) return 0;

  try {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    if (keys.length === 0) {
      cacheLogger.info('No cached entries to clear');
      await redis.quit();
      return 0;
    }
    const deleted = await redis.del(...keys);
    cacheLogger.info('Cleared cached entries', { count: deleted });
    await redis.quit();
    return deleted;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    cacheLogger.error('Failed to clear cache', { error: msg });
    await redis.quit();
    return 0;
  }
}

/** Check SDK cache status without creating a full client. */
export async function getSdkCacheStatus(): Promise<{
  enabled: boolean;
  connected: boolean;
  keyCount: number;
}> {
  const config = optionalEnv();
  if (!config?.SDK_CACHE_ENABLED) {
    return { enabled: false, connected: false, keyCount: 0 };
  }

  const redis = await createRedisClient(config.SDK_CACHE_REDIS_URL);
  if (!redis) {
    return { enabled: true, connected: false, keyCount: 0 };
  }

  try {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    await redis.quit();
    return { enabled: true, connected: true, keyCount: keys.length };
  } catch {
    await redis.quit();
    return { enabled: true, connected: false, keyCount: 0 };
  }
}
