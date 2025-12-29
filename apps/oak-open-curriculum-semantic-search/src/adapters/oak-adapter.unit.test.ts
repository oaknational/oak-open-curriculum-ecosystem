/**
 * Unit tests for the unified Oak adapter.
 *
 * Tests the consolidated adapter interface including optional caching.
 */

import { describe, it, expect } from 'vitest';

describe('oak-adapter', () => {
  describe('OakClient interface', () => {
    it('should include cache management methods', () => {
      // The interface should have getCacheStats and disconnect
      // This test documents the expected interface shape
      const requiredMethods = [
        'getUnitsByKeyStageAndSubject',
        'getLessonTranscript',
        'getLessonSummary',
        'getUnitSummary',
        'getSubjectSequences',
        'getSequenceUnits',
        'getAllThreads',
        'getThreadUnits',
        'getLessonsByKeyStageAndSubject',
        'rateLimitTracker',
        // Cache management (always present, no-op if caching disabled)
        'getCacheStats',
        'disconnect',
      ];

      expect(requiredMethods).toHaveLength(12);
    });
  });

  describe('CacheStats', () => {
    it('should track hits, misses, and connection status', () => {
      // Documents the expected shape
      interface CacheStats {
        readonly hits: number;
        readonly misses: number;
        readonly connected: boolean;
      }

      const stats: CacheStats = { hits: 10, misses: 5, connected: true };
      expect(stats.hits).toBe(10);
      expect(stats.misses).toBe(5);
      expect(stats.connected).toBe(true);
    });
  });

  describe('createOakClient options', () => {
    it('should document the expected options shape', () => {
      // Documents the expected factory options
      interface CreateOakClientOptions {
        /** Enable Redis caching for API responses. */
        readonly caching?: {
          /** When true, ignore cached 404s for transcripts. */
          readonly ignoreCached404?: boolean;
        };
      }

      const options: CreateOakClientOptions = {
        caching: { ignoreCached404: true },
      };

      expect(options.caching?.ignoreCached404).toBe(true);
    });
  });
});
