/**
 * Oak Adapter - Unified client for Oak Curriculum API.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * Caching is an optional capability configured via options.
 *
 * @see ADR-066 (caching), ADR-088 (Result pattern)
 */

import { createOakBaseClient } from '@oaknational/curriculum-sdk';
import { createRedisClient, withRedisConnection } from './sdk-cache';
import { cacheLogger } from '../lib/logger';
import type { makeGetAllThreads, makeGetThreadUnits } from './oak-adapter-threads';
import { createUncachedClient, createCachedClient, buildClientConfig } from './sdk-client-factory';
import type {
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
  GetSubjectAssetsFn,
} from './oak-adapter-types';

export type { LessonGroupResponse, LessonsPaginationOptions, SubjectSequenceEntry };
export type { GetUnitsFn, GetTranscriptFn, GetLessonSummaryFn, GetUnitSummaryFn };
export type { GetSubjectSequencesFn, GetSequenceUnitsFn, GetLessonsByKeyStageAndSubjectFn };
export type { GetSubjectAssetsFn };
export type {
  ThreadEntry,
  ThreadUnitEntry,
  GetAllThreadsFn,
  GetThreadUnitsFn,
} from './oak-adapter-threads';

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
  /** Fetches all assets for a subject/keystage. Used for video availability check. */
  getSubjectAssets: GetSubjectAssetsFn;
  rateLimitTracker: ReturnType<typeof createOakBaseClient>['rateLimitTracker'];
  getCacheStats: () => CacheStats;
  disconnect: () => Promise<void>;
}

/** Environment config required to create an Oak client. */
export interface OakClientEnv {
  readonly OAK_API_KEY?: string;
  readonly SEARCH_INDEX_TARGET?: 'primary' | 'sandbox';
  readonly SDK_CACHE_ENABLED?: boolean;
  readonly SDK_CACHE_REDIS_URL?: string;
  readonly SDK_CACHE_TTL_DAYS?: number;
}

/** Options for creating an Oak client. */
export interface CreateOakClientOptions {
  /** Validated env. When omitted, client creation will fail. */
  readonly env?: OakClientEnv;
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

function requireOakApiKey(options: CreateOakClientOptions): OakClientEnv & { OAK_API_KEY: string } {
  const envConfig = options.env;
  if (!envConfig?.OAK_API_KEY) {
    throw new Error(
      'OAK_API_KEY is required. Pass env from loadRuntimeConfig: createOakClient({ env: config.env })',
    );
  }
  return { ...envConfig, OAK_API_KEY: envConfig.OAK_API_KEY };
}

/**
 * Create an Oak client with optional caching.
 *
 * @param options - Configuration; env is required (pass from loadRuntimeConfig)
 * @returns Oak client instance
 */
export async function createOakClient(options: CreateOakClientOptions = {}): Promise<OakClient> {
  const envConfig = requireOakApiKey(options);
  const ignoreCached404 = resolveCacheBypass(options);

  if (clientSingleton && !ignoreCached404) {
    return clientSingleton;
  }

  const baseClient = createOakBaseClient(buildClientConfig(envConfig.OAK_API_KEY));

  if (!envConfig.SDK_CACHE_ENABLED) {
    cacheLogger.info('SDK caching disabled');
    return setSingletonIfNotIgnoring(createUncachedClient(baseClient), ignoreCached404);
  }

  return createClientWithCaching(
    baseClient,
    envConfig.SDK_CACHE_REDIS_URL ?? 'redis://localhost:6379',
    envConfig.SDK_CACHE_TTL_DAYS ?? 14,
    ignoreCached404,
  );
}

function resolveCacheBypass(options: CreateOakClientOptions): boolean {
  return options.caching?.ignoreCached404 ?? false;
}

/**
 * SDK cache connection status.
 * Used by {@link getSdkCacheStatus} to report cache availability.
 */
export interface CacheStatus {
  readonly enabled: boolean;
  readonly connected: boolean;
  readonly keyCount: number;
}

const DISCONNECTED_STATUS: CacheStatus = { enabled: true, connected: false, keyCount: 0 };

/** Check SDK cache status without creating a full client. */
export async function getSdkCacheStatus(env: OakClientEnv): Promise<CacheStatus> {
  if (!env.SDK_CACHE_ENABLED) {
    return { enabled: false, connected: false, keyCount: 0 };
  }

  return withRedisConnection<CacheStatus>(
    env.SDK_CACHE_REDIS_URL ?? 'redis://localhost:6379',
    DISCONNECTED_STATUS,
    async (redis) => {
      const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
      return { enabled: true, connected: true, keyCount: keys.length };
    },
  );
}
