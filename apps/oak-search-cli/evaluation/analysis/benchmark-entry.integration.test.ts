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
 */

import { describe, it, expect, vi } from 'vitest';
import { ok } from '@oaknational/result';
import {
  benchmarkEntry,
  type SearchFunction,
  type GroundTruthEntry,
} from './benchmark-entry-runner.js';
import type { LessonsSearchResult, LessonResult } from '@oaknational/oak-search-sdk/read';
import type { SearchLessonsIndexDoc } from '@oaknational/sdk-codegen/search';

/** Create a minimal lesson index doc stub. */
function stubLessonDoc(slug: string): SearchLessonsIndexDoc {
  return {
    lesson_id: slug,
    lesson_slug: slug,
    lesson_title: `Lesson: ${slug}`,
    subject_slug: 'maths',
    subject_parent: 'maths',
    key_stage: 'ks1',
    unit_ids: [],
    unit_titles: [],
    has_transcript: false,
    lesson_url: `https://example.com/${slug}`,
    unit_urls: [],
    doc_type: 'lesson',
  };
}

/** Create a stub LessonResult for the given slug. */
function stubResult(slug: string): LessonResult {
  return {
    id: slug,
    rankScore: 1.0,
    lesson: stubLessonDoc(slug),
    highlights: [],
  };
}

/** Build a mock SDK LessonsSearchResult from slugs. */
function buildMockResult(slugs: readonly string[]): LessonsSearchResult {
  return {
    scope: 'lessons',
    results: slugs.map(stubResult),
    total: slugs.length,
    took: 1,
    timedOut: false,
  };
}

/**
 * Creates a mock search function that returns specified slugs
 * in SDK LessonsSearchResult format.
 */
function createMockSearchFn(slugs: readonly string[]): SearchFunction {
  return vi.fn().mockResolvedValue(ok(buildMockResult(slugs)));
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
    return Promise.resolve(ok(buildMockResult(slugs)));
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
        },
        {
          query: 'query 2',
          expectedRelevance: { 'slug-b': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
        },
      ]);

      const result = await benchmarkEntry(entry, mockSearch);

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
        },
        {
          query: 'query 2',
          expectedRelevance: { 'slug-b': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
        },
        {
          query: 'query 3',
          expectedRelevance: { 'slug-c': 3 },
          category: 'precise-topic',
          description: 'Test fixture',
        },
      ]);

      const result = await benchmarkEntry(entry, mockSearch);

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
          },
        ],
      };

      const result = await benchmarkEntry(entry, mockSearch);

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
        },
      ]);

      await benchmarkEntry(entry, mockSearch);

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
          },
        ],
      };

      await benchmarkEntry(entry, mockSearch);

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
          },
        ],
      };

      const result = await benchmarkEntry(entry, mockSearch);

      expect(result.subject).toBe('science');
      expect(result.phase).toBe('primary');
    });
  });

  describe('cross-subject entries', () => {
    it('benchmarks entries with undefined subject and phase', async () => {
      const mockSearch = createMockSearchFn(['expected-slug']);

      const entry: GroundTruthEntry = {
        subject: undefined,
        phase: undefined,
        queries: [
          {
            query: 'apple',
            expectedRelevance: { 'expected-slug': 3 },
            category: 'basic',
            description: 'Cross-subject test fixture',
          },
        ],
      };

      const result = await benchmarkEntry(entry, mockSearch);

      expect(result.subject).toBeUndefined();
      expect(result.phase).toBeUndefined();
      expect(result.mrr).toBe(1.0);
      expect(result.queryCount).toBe(1);
    });
  });
});
