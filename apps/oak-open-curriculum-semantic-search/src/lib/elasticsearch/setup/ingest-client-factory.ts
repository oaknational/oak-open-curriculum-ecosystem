/**
 * @module ingest-client-factory
 * @description Factory for creating Oak SDK clients with optional Redis caching.
 * Handles cache status detection and appropriate client initialization.
 */

import { createOakSdkClient } from '../../../adapters/oak-adapter-sdk.js';
import {
  createCachedOakSdkClient,
  getSdkCacheStatus,
  type CachedOakClient,
} from '../../../adapters/oak-adapter-cached.js';

/** CLI-friendly log helper for progress reporting. */
function cliLog(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Create an Oak SDK client with optional caching.
 * Returns a CachedOakClient that gracefully falls back to uncached if Redis unavailable.
 */
export async function createIngestionClient(): Promise<CachedOakClient> {
  cliLog('Creating Oak SDK client...');
  const cacheStatus = await getSdkCacheStatus();

  if (cacheStatus.enabled && cacheStatus.connected) {
    const client = await createCachedOakSdkClient();
    cliLog(`SDK client created with Redis caching (${cacheStatus.keyCount} cached entries)`);
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
    cliLog('SDK client created (cache enabled but Redis not available)');
  } else {
    cliLog('SDK client created (caching disabled)');
  }

  return client;
}
