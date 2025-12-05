/**
 * @module oak-adapter-cached.unit.test
 * @description Unit tests for SDK cache types and exports.
 *
 * The caching implementation uses the app's env.ts for configuration,
 * so config parsing is tested in env.unit.test.ts.
 */

import { describe, it, expect } from 'vitest';
import type { CacheStats, CachedOakClient } from './oak-adapter-cached';

describe('CacheStats type', () => {
  it('has required properties', () => {
    const stats: CacheStats = {
      hits: 10,
      misses: 5,
      connected: true,
    };

    expect(stats.hits).toBe(10);
    expect(stats.misses).toBe(5);
    expect(stats.connected).toBe(true);
  });
});

describe('CachedOakClient interface', () => {
  it('extends OakClient with cache methods', () => {
    // Type-level test - if this compiles, the interface is correct
    const mockClient: CachedOakClient = {
      getUnitsByKeyStageAndSubject: async () => [],
      getLessonsByKeyStageAndSubject: async () => [],
      getUnitSummary: async () => ({}),
      getLessonSummary: async () => ({}),
      getLessonTranscript: async () => ({ transcript: '', vtt: '' }),
      getSubjectSequences: async () => [],
      getSequenceUnits: async () => [],
      getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
      disconnect: async () => {
        /* mock: no Redis connection to close */
      },
    };

    expect(mockClient.getCacheStats()).toEqual({
      hits: 0,
      misses: 0,
      connected: false,
    });
  });
});
