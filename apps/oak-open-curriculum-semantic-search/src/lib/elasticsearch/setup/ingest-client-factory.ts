/**
 * Factory for creating Oak clients for ingestion.
 *
 * By default, ingestion requires Redis cache to be available to ensure
 * API data is only downloaded once. Use bypassCache to allow uncached operation.
 */

import {
  createOakClient,
  getSdkCacheStatus,
  type OakClient,
} from '../../../adapters/oak-adapter.js';
import { ingestLogger } from '../../logger';

/** Error thrown when cache is required but unavailable. */
export class CacheRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheRequiredError';
  }
}

/** Options for creating an ingestion client. */
export interface IngestionClientOptions {
  /** If true, allow ingestion without cache. Default: false (cache required). */
  readonly bypassCache?: boolean;
  /**
   * If true, ignore cached 404 responses for transcripts.
   * Use when re-checking if transcripts have been added after initial ingestion.
   * @default false
   */
  readonly ignoreCached404?: boolean;
}

/** Build error message for cache requirement. */
function buildCacheRequiredMessage(enabled: boolean): string {
  const reason = enabled
    ? 'Redis cache is enabled but not connected. Start Redis with: docker compose up -d'
    : 'SDK caching is not enabled. Set SDK_CACHE_ENABLED=true in .env.local';
  return (
    `Cache is required for ingestion but unavailable. ${reason}\n` +
    'Use --bypass-cache to allow uncached operation (not recommended for full ingestion).'
  );
}

/** Log cache status after client creation. */
function logCacheStatus(
  connected: boolean,
  enabled: boolean,
  keyCount: number,
  ignoreCached404: boolean,
): void {
  if (connected) {
    ingestLogger.info('Oak client created with Redis caching', {
      cachedEntries: keyCount,
      ignoreCached404,
      note: 'API responses will be cached - subsequent runs will be faster',
    });
  } else {
    const reason = enabled ? 'Redis not available' : 'caching disabled';
    ingestLogger.warn('Oak client created WITHOUT caching', {
      bypassCache: true,
      warning: 'All API requests will be made fresh - slower and may hit rate limits',
      reason,
    });
  }
}

/**
 * Create an Oak client for ingestion.
 *
 * By default, requires Redis cache to be available. This ensures that API
 * data is only downloaded once, which is critical for large ingestions.
 *
 * @param options - Client creation options
 * @throws CacheRequiredError if cache is required but Redis is unavailable
 */
export async function createIngestionClient(
  options: IngestionClientOptions = {},
): Promise<OakClient> {
  const { bypassCache = false, ignoreCached404 = false } = options;
  ingestLogger.debug('Creating Oak client', { bypassCache, ignoreCached404 });

  const cacheStatus = await getSdkCacheStatus();

  if (!cacheStatus.connected && !bypassCache) {
    throw new CacheRequiredError(buildCacheRequiredMessage(cacheStatus.enabled));
  }

  const client = await createOakClient({ caching: { ignoreCached404 } });
  logCacheStatus(cacheStatus.connected, cacheStatus.enabled, cacheStatus.keyCount, ignoreCached404);

  return client;
}
