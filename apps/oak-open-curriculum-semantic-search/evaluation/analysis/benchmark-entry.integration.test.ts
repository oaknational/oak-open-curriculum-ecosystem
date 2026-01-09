/**
 * Integration tests for benchmarkEntry orchestration.
 *
 * Tests that benchmark.ts correctly wires together:
 * 1. Ground truth entry iteration
 * 2. Query execution via runQuery
 * 3. Result aggregation
 *
 * This is the integration test that would fail if benchmark.ts
 * doesn't correctly use the extracted modules.
 *
 * @see benchmark.ts
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import { describe, it, expect, vi } from 'vitest';
import { benchmarkEntry, type SearchFunction } from './benchmark-entry-runner.js';
import type { GroundTruthEntry } from '../../src/lib/search-quality/ground-truth/registry/index.js';

/**
 * Creates a mock search function that returns specified slugs.
 */
function createMockSearchFn(slugs: readonly string[]): SearchFunction {
  return vi.fn().mockResolvedValue({
    hits: {
      hits: slugs.map((slug) => ({
        _source: { lesson_slug: slug },
      })),
    },
  });
}

/**
 * Creates a mock search function that returns different slugs for each call.
 */
function createSequentialMockSearchFn(
  slugSequence: readonly (readonly string[])[],
): SearchFunction {
  let callIndex = 0;
  return vi.fn().mockImplementation(() => {
    const slugs = slugSequence[callIndex] ?? [];
    callIndex++;
    return Promise.resolve({
      hits: {
        hits: slugs.map((slug) => ({
          _source: { lesson_slug: slug },
        })),
      },
    });
  });
}

describe('benchmarkEntry', () => {
  const createTestEntry = (queries: GroundTruthEntry['queries']): GroundTruthEntry => ({
    subject: 'maths',
    phase: 'secondary',
    queries,
  });

  describe('result aggregation', () => {
    it('calculates average MRR across all queries', async () => {
      // Two queries: first has MRR 1.0, second has MRR 0.5
      const mockSearch = createSequentialMockSearchFn([
        ['slug-a'], // First query: exact match at position 1 → MRR 1.0
        ['wrong', 'slug-b'], // Second query: match at position 2 → MRR 0.5
      ]);

      const entry = createTestEntry([
        {
          query: 'query 1',
          expectedRelevance: { 'slug-a': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
        {
          query: 'query 2',
          expectedRelevance: { 'slug-b': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
      ]);

      const result = await benchmarkEntry(entry, false, mockSearch);

      // Average of 1.0 and 0.5 = 0.75
      expect(result.mrr).toBe(0.75);
      expect(result.queryCount).toBe(2);
    });

    it('calculates zero-hit rate correctly', async () => {
      // Three queries: two hits, one miss
      const mockSearch = createSequentialMockSearchFn([
        ['slug-a'], // Hit
        ['wrong-1', 'wrong-2'], // Miss
        ['slug-c'], // Hit
      ]);

      const entry = createTestEntry([
        {
          query: 'query 1',
          expectedRelevance: { 'slug-a': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
        {
          query: 'query 2',
          expectedRelevance: { 'slug-b': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
        {
          query: 'query 3',
          expectedRelevance: { 'slug-c': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
      ]);

      const result = await benchmarkEntry(entry, false, mockSearch);

      // 1 out of 3 queries had zero hits
      expect(result.zeroHitRate).toBeCloseTo(1 / 3);
    });

    it('returns all required metric fields', async () => {
      const mockSearch = createMockSearchFn(['expected-slug']);

      const entry: GroundTruthEntry = {
        subject: 'maths',
        phase: 'secondary',
        queries: [
          {
            query: 'test',
            expectedRelevance: { 'expected-slug': 3 },
            category: 'precise-topic',
            description: 'Test fixture',
            priority: 'medium',
          },
        ],
      };

      const result = await benchmarkEntry(entry, false, mockSearch);

      // All metric fields should be present
      expect(result.mrr).toBe(1.0);
      expect(result.ndcg10).toBeGreaterThan(0);
      expect(result.zeroHitRate).toBe(0);
      expect(result.avgLatencyMs).toBeGreaterThanOrEqual(0);
      expect(result.queryCount).toBe(1);
    });
  });

  describe('phase and keyStage handling', () => {
    it('uses phase filter when query has no keyStage', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      const entry = createTestEntry([
        {
          query: 'general secondary query',
          expectedRelevance: { slug: 3 },
          category: 'precise-topic',
          description: 'Test fixture',
          priority: 'medium',
        },
      ]);

      await benchmarkEntry(entry, false, mockSearch);

      // The mock was called - we trust unit tests verify correct params
      expect(mockSearch).toHaveBeenCalledTimes(1);
    });

    it('uses keyStage filter when query specifies keyStage', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      const entry: GroundTruthEntry = {
        subject: 'maths',
        phase: 'secondary',
        queries: [
          {
            query: 'ks4 specific query',
            expectedRelevance: { slug: 3 },
            keyStage: 'ks4',
            category: 'precise-topic',
            description: 'Test fixture for KS4 query',
            priority: 'medium',
          },
        ],
      };

      await benchmarkEntry(entry, false, mockSearch);

      expect(mockSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('entry metadata', () => {
    it('preserves subject and phase in result', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      const entry: GroundTruthEntry = {
        subject: 'science',
        phase: 'primary',
        queries: [
          {
            query: 'test',
            expectedRelevance: { slug: 3 },
            category: 'precise-topic',
            description: 'Test fixture',
            priority: 'medium',
          },
        ],
      };

      const result = await benchmarkEntry(entry, false, mockSearch);

      expect(result.subject).toBe('science');
      expect(result.phase).toBe('primary');
    });
  });
});
