/**
 * Oak Adapter - Unified client for Oak Curriculum API.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * Caching is an optional capability configured via options.
 *
 * @see ADR-066 (caching), ADR-088 (Result pattern)
 * @packageDocumentation
 */

import { createOakBaseClient } from '@oaknational/oak-curriculum-sdk';
import { env, optionalEnv } from '../lib/env';
import { createRedisClient, withRedisConnection } from './sdk-cache';
import { cacheLogger } from '../lib/logger';
import type { makeGetAllThreads, makeGetThreadUnits } from './oak-adapter-threads';
import { createUncachedClient, createCachedClient, buildClientConfig } from './sdk-client-factory';
import type {
  UnitListEntry,
  LessonGroupResponse,
  LessonsPaginationOptions,
  SubjectSequenceEntry,
  GetUnitsFn,
  GetTranscriptFn,
  GetLessonSummaryFn,
  GetUnitSummaryFn,
  GetSubjectSequencesFn,
  GetSequenceUnitsFn,
  GetLessonsByKeyStageAndSubjectFn,
} from './oak-adapter-types';

// Re-export types for consumers
export type { UnitListEntry, LessonGroupResponse, LessonsPaginationOptions, SubjectSequenceEntry };
export type { GetUnitsFn, GetTranscriptFn, GetLessonSummaryFn, GetUnitSummaryFn };
export type { GetSubjectSequencesFn, GetSequenceUnitsFn, GetLessonsByKeyStageAndSubjectFn };
export type {
  ThreadEntry,
  ThreadUnitEntry,
  GetAllThreadsFn,
  GetThreadUnitsFn,
} from './oak-adapter-threads';

// Re-export cache constants
export { NOT_FOUND_SENTINEL } from './sdk-cache';

// =============================================================================
// Types
// =============================================================================

/** Statistics about cache usage during the current session. */
export interface CacheStats {
  readonly hits: number;
  readonly misses: number;
  readonly connected: boolean;
}

/**
 * Oak client interface - unified API for curriculum data access.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * Cache management methods are always present (no-op when caching disabled).
 */
export interface OakClient {
  getUnitsByKeyStageAndSubject: GetUnitsFn;
  getLessonTranscript: GetTranscriptFn;
  getLessonSummary: GetLessonSummaryFn;
  getUnitSummary: GetUnitSummaryFn;
  getSubjectSequences: GetSubjectSequencesFn;
  getSequenceUnits: GetSequenceUnitsFn;
  getAllThreads: ReturnType<typeof makeGetAllThreads>;
  getThreadUnits: ReturnType<typeof makeGetThreadUnits>;
  getLessonsByKeyStageAndSubject: GetLessonsByKeyStageAndSubjectFn;
  rateLimitTracker: ReturnType<typeof createOakBaseClient>['rateLimitTracker'];
  getCacheStats: () => CacheStats;
  disconnect: () => Promise<void>;
}

/** Options for creating an Oak client. */
export interface CreateOakClientOptions {
  readonly caching?: {
    readonly ignoreCached404?: boolean;
  };
}

/** Cache key prefix with version for schema change invalidation. */
const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

// =============================================================================
// Client Singleton
// =============================================================================

let clientSingleton: OakClient | null = null;

function setSingletonIfNotIgnoring(client: OakClient, ignoreCached404: boolean): OakClient {
  if (!ignoreCached404) {
    clientSingleton = client;
  }
  return client;
}

async function createClientWithCaching(
  baseClient: ReturnType<typeof createOakBaseClient>,
  redisUrl: string,
  ttlDays: number,
  ignoreCached404: boolean,
): Promise<OakClient> {
  const redis = await createRedisClient(redisUrl);
  if (!redis) {
    cacheLogger.warn('Redis unavailable, running without cache');
    return setSingletonIfNotIgnoring(createUncachedClient(baseClient), ignoreCached404);
  }

  cacheLogger.info('SDK caching enabled', { ttlDays, ignoreCached404 });
  const client = createCachedClient(baseClient, redis, ttlDays, ignoreCached404);
  return setSingletonIfNotIgnoring(client, ignoreCached404);
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create an Oak client with optional caching.
 *
 * @param options - Optional configuration overrides
 * @returns Oak client instance
 */
export async function createOakClient(options: CreateOakClientOptions = {}): Promise<OakClient> {
  const ignoreCached404 = options.caching?.ignoreCached404 ?? false;

  if (clientSingleton && !ignoreCached404) {
    return clientSingleton;
  }

  const baseClient = createOakBaseClient(buildClientConfig(env().OAK_EFFECTIVE_KEY));
  const envConfig = optionalEnv();

  if (!envConfig?.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching disabled');
    return setSingletonIfNotIgnoring(createUncachedClient(baseClient), ignoreCached404);
  }

  return createClientWithCaching(
    baseClient,
    envConfig.SDK_CACHE_REDIS_URL,
    envConfig.SDK_CACHE_TTL_DAYS,
    ignoreCached404,
  );
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

interface CacheStatus {
  readonly enabled: boolean;
  readonly connected: boolean;
  readonly keyCount: number;
}

const DISCONNECTED_STATUS: CacheStatus = { enabled: true, connected: false, keyCount: 0 };

/** Check SDK cache status without creating a full client. */
export async function getSdkCacheStatus(): Promise<CacheStatus> {
  const config = optionalEnv();
  if (!config?.SDK_CACHE_ENABLED) {
    return { enabled: false, connected: false, keyCount: 0 };
  }

  return withRedisConnection<CacheStatus>(
    config.SDK_CACHE_REDIS_URL,
    DISCONNECTED_STATUS,
    async (redis) => {
      const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
      return { enabled: true, connected: true, keyCount: keys.length };
    },
  );
}

/** Reset singleton for testing purposes. @internal */
export function resetClientSingleton(): void {
  clientSingleton = null;
}
