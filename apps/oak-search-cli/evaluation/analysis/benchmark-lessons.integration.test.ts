/**
 * Integration tests for benchmark query execution.
 *
 * Tests that runQuery correctly:
 * 1. Passes SDK parameters to the search function
 * 2. Extracts slugs from SDK results
 * 3. Calculates metrics from the response
 *
 * Uses simple mock SDK search function injected as parameter (no global mocking).
 *
 * @see benchmark.ts
 * @see ADR-078 Dependency Injection for Testability
 */

import { describe, it, expect, vi } from 'vitest';
import { ok } from '@oaknational/result';
import { runQuery, type SearchFunction } from './benchmark-query-runner-lessons';
import type { LessonsSearchResult, LessonResult } from '@oaknational/oak-search-sdk';
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

/**
 * Creates a mock search function that returns specified slugs
 * in SDK LessonsSearchResult format.
 */
function createMockSearchFn(slugs: readonly string[]): SearchFunction {
  const result: LessonsSearchResult = {
    scope: 'lessons',
    results: slugs.map(stubResult),
    total: slugs.length,
    took: 1,
    timedOut: false,
  };
  return vi.fn().mockResolvedValue(ok(result));
}

describe('runQuery', () => {
  describe('metrics calculation', () => {
    it('returns MRR of 1.0 when first result matches expected', async () => {
      const mockSearch = createMockSearchFn(['expected-slug', 'other-slug']);
      const expectedRelevance = { 'expected-slug': 3 };

      const result = await runQuery(
        {
          query: 'test query',
          expectedRelevance,
          subject: 'maths',
          phase: 'secondary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(result.mrr).toBe(1.0);
      expect(result.hasHit).toBe(true);
    });

    it('returns MRR of 0.5 when first match is at position 2', async () => {
      const mockSearch = createMockSearchFn(['wrong-slug', 'expected-slug', 'other-slug']);
      const expectedRelevance = { 'expected-slug': 3 };

      const result = await runQuery(
        {
          query: 'test query',
          expectedRelevance,
          subject: 'maths',
          phase: 'secondary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(result.mrr).toBe(0.5);
      expect(result.hasHit).toBe(true);
    });

    it('returns MRR of 0 when no results match expected', async () => {
      const mockSearch = createMockSearchFn(['wrong-1', 'wrong-2', 'wrong-3']);
      const expectedRelevance = { 'expected-slug': 3 };

      const result = await runQuery(
        {
          query: 'test query',
          expectedRelevance,
          subject: 'maths',
          phase: 'secondary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(result.mrr).toBe(0);
      expect(result.hasHit).toBe(false);
    });

    it('returns MRR of 0 when search returns empty results', async () => {
      const mockSearch = createMockSearchFn([]);
      const expectedRelevance = { 'expected-slug': 3 };

      const result = await runQuery(
        {
          query: 'test query',
          expectedRelevance,
          subject: 'maths',
          phase: 'secondary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(result.mrr).toBe(0);
      expect(result.hasHit).toBe(false);
    });
  });

  describe('request building', () => {
    it('passes SDK params with subject when no queryKeyStage', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      await runQuery(
        {
          query: 'quadratic equations',
          expectedRelevance: { slug: 3 },
          subject: 'maths',
          phase: 'secondary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(mockSearch).toHaveBeenCalledWith({
        text: 'quadratic equations',
        subject: 'maths',
        keyStage: undefined,
        size: 10,
      });
    });

    it('passes SDK params with keyStage when queryKeyStage specified', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      await runQuery(
        {
          query: 'completing the square higher',
          expectedRelevance: { slug: 3 },
          subject: 'maths',
          phase: 'secondary',
          queryKeyStage: 'ks4',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(mockSearch).toHaveBeenCalledWith({
        text: 'completing the square higher',
        subject: 'maths',
        keyStage: 'ks4',
        size: 10,
      });
    });
  });

  describe('latency tracking', () => {
    it('records latency in milliseconds', async () => {
      const mockSearch = createMockSearchFn(['slug']);

      const result = await runQuery(
        {
          query: 'test',
          expectedRelevance: { slug: 3 },
          subject: 'maths',
          phase: 'primary',
          category: 'precise-topic',
        },
        mockSearch,
      );

      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
      expect(typeof result.latencyMs).toBe('number');
    });
  });
});
