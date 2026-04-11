/**
 * Oak SDK client factory helpers.
 *
 * Pure functions for creating cached and uncached client instances.
 *
 * @see `../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md`
 */

import type Redis from 'ioredis';
import type {
  OakApiClient,
  OakClientConfig,
  createOakBaseClient,
} from '@oaknational/curriculum-sdk';
import { isLessonSummary, isUnitSummary } from '../types/oak';
import { isTranscriptResponse } from './sdk-guards';
import {
  calculateTtlWithJitter,
  withCache,
  withCacheAndNegative,
  type CacheOperations,
} from './sdk-cache';
import { cacheLogger } from '../lib/logger';
import { makeGetAllThreads, makeGetThreadUnits } from './oak-adapter-threads';
import {
  makeGetUnitsByKeyStageAndSubject,
  makeGetLessonTranscript,
  makeGetLessonSummary,
  makeGetUnitSummary,
  makeGetSubjectSequences,
  makeGetSequenceUnits,
  makeGetLessonsByKeyStageAndSubject,
  makeGetSubjectAssets,
} from './sdk-api-methods';
import type { OakClient, CacheStats } from './oak-adapter';
import type {
  GetUnitsFn,
  GetTranscriptFn,
  GetLessonSummaryFn,
  GetUnitSummaryFn,
  GetSubjectSequencesFn,
  GetSequenceUnitsFn,
  GetLessonsByKeyStageAndSubjectFn,
  GetSubjectAssetsFn,
} from './oak-adapter-types';

/** Return type of createBaseMethods - all API methods without cache management. */
interface BaseMethods {
  readonly getUnitsByKeyStageAndSubject: GetUnitsFn;
  readonly getLessonTranscript: GetTranscriptFn;
  readonly getLessonSummary: GetLessonSummaryFn;
  readonly getUnitSummary: GetUnitSummaryFn;
  readonly getSubjectSequences: GetSubjectSequencesFn;
  readonly getSequenceUnits: GetSequenceUnitsFn;
  readonly getAllThreads: ReturnType<typeof makeGetAllThreads>;
  readonly getThreadUnits: ReturnType<typeof makeGetThreadUnits>;
  readonly getLessonsByKeyStageAndSubject: GetLessonsByKeyStageAndSubjectFn;
  readonly getSubjectAssets: GetSubjectAssetsFn;
}

/** Create base client methods without caching. */
function createBaseMethods(apiClient: OakApiClient): BaseMethods {
  return {
    getUnitsByKeyStageAndSubject: makeGetUnitsByKeyStageAndSubject(apiClient),
    getLessonTranscript: makeGetLessonTranscript(apiClient),
    getLessonSummary: makeGetLessonSummary(apiClient),
    getUnitSummary: makeGetUnitSummary(apiClient),
    getSubjectSequences: makeGetSubjectSequences(apiClient),
    getSequenceUnits: makeGetSequenceUnits(apiClient),
    getAllThreads: makeGetAllThreads(apiClient),
    getThreadUnits: makeGetThreadUnits(apiClient),
    getLessonsByKeyStageAndSubject: makeGetLessonsByKeyStageAndSubject(apiClient),
    getSubjectAssets: makeGetSubjectAssets(apiClient),
  };
}

/** Adapt Redis client to CacheOperations interface. */
function createCacheOps(redis: Redis): CacheOperations {
  return {
    get: (key) => redis.get(key),
    setex: async (key, ttl, value) => {
      await redis.setex(key, ttl, value);
    },
  };
}

/** Create client without caching. */
export function createUncachedClient(
  baseClient: ReturnType<typeof createOakBaseClient>,
): OakClient {
  const methods = createBaseMethods(baseClient.client);
  const noCacheStats: CacheStats = { hits: 0, misses: 0, connected: false };
  return {
    ...methods,
    rateLimitTracker: baseClient.rateLimitTracker,
    getCacheStats: () => noCacheStats,
    disconnect: () => Promise.resolve(),
  };
}

function createDisconnect(redis: Redis): () => Promise<void> {
  return async () => {
    await redis.quit();
    cacheLogger.info('Disconnected from Redis');
  };
}

/** Create client with Redis caching. */
export function createCachedClient(
  baseClient: ReturnType<typeof createOakBaseClient>,
  redis: Redis,
  ttlDays: number,
  ignoreCached404: boolean,
): OakClient {
  const baseMethods = createBaseMethods(baseClient.client);
  const stats = { hits: 0, misses: 0 };
  const ops = createCacheOps(redis);
  const ttlFn = (days: number) => calculateTtlWithJitter(days);

  return {
    ...baseMethods,
    rateLimitTracker: baseClient.rateLimitTracker,
    getUnitSummary: withCache(
      baseMethods.getUnitSummary,
      ops,
      'unit-summary',
      ttlDays,
      stats,
      isUnitSummary,
      ttlFn,
    ),
    getLessonSummary: withCache(
      baseMethods.getLessonSummary,
      ops,
      'lesson-summary',
      ttlDays,
      stats,
      isLessonSummary,
      ttlFn,
    ),
    getLessonTranscript: withCacheAndNegative(
      baseMethods.getLessonTranscript,
      ops,
      'lesson-transcript',
      ttlDays,
      stats,
      isTranscriptResponse,
      ignoreCached404,
      ttlFn,
    ),
    getCacheStats: () => ({ hits: stats.hits, misses: stats.misses, connected: true }),
    disconnect: createDisconnect(redis),
  };
}

/** Build Oak client configuration. */
export function buildClientConfig(apiKey: string): OakClientConfig {
  return {
    apiKey,
    rateLimit: { enabled: true, minRequestInterval: 200 },
    retry: {
      enabled: true,
      maxRetries: 5,
      initialDelayMs: 1000,
      retryableStatusCodes: [429, 503, 404, 500],
      statusCodeMaxRetries: { 404: 2, 500: 2 },
    },
  };
}
