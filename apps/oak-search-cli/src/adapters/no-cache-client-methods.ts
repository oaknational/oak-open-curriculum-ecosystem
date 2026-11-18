/**
 * Cache-management methods of an `OakClient` that holds no cache.
 *
 * `OakClient` carries `getCacheStats` and `disconnect` on every implementation
 * so a composition root reports on, and releases, whichever client the
 * configuration selected through one call, with no optional method to probe
 * first (principles.md §Strict and Complete). The uncached API client and the
 * fixture client share these bodies: with no cache there are no hits, no
 * misses and no connection, and nothing to release.
 */

import type { CacheStats } from './oak-adapter-types';

/** The statistics of a client with no cache: nothing hit, missed or connected. */
export function reportNoCacheStats(): CacheStats {
  return { hits: 0, misses: 0, connected: false };
}

/**
 * `OakClient.disconnect` for a client that holds no connection.
 *
 * Resolves at once: there is no handle to close.
 */
export function disconnectWithoutConnection(): Promise<void> {
  return Promise.resolve();
}
