/**
 * Factory for creating Oak SDK clients with optional Redis caching.
 * Handles cache status detection and appropriate client initialization.
 */

import { createOakSdkClient } from '../../../adapters/oak-adapter-sdk.js';
import {
  createCachedOakSdkClient,
  getSdkCacheStatus,
  type CachedOakClient,
} from '../../../adapters/oak-adapter-cached.js';
import { sandboxLogger } from '../../logger';

/**
 * Create an Oak SDK client with optional caching.
 * Returns a CachedOakClient that gracefully falls back to uncached if Redis unavailable.
 */
export async function createIngestionClient(): Promise<CachedOakClient> {
  sandboxLogger.debug('Creating Oak SDK client');
  const cacheStatus = await getSdkCacheStatus();

  if (cacheStatus.enabled && cacheStatus.connected) {
    const client = await createCachedOakSdkClient();
    sandboxLogger.debug('SDK client created with Redis caching', {
      cachedEntries: cacheStatus.keyCount,
    });
    return client;
  }

  const baseClient = createOakSdkClient();
  const client: CachedOakClient = {
    ...baseClient,
    getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
    disconnect: async () => {
      /* no cache connection to close */
    },
  };

  if (cacheStatus.enabled) {
    sandboxLogger.debug('SDK client created', { note: 'cache enabled but Redis not available' });
  } else {
    sandboxLogger.debug('SDK client created', { note: 'caching disabled' });
  }

  return client;
}
