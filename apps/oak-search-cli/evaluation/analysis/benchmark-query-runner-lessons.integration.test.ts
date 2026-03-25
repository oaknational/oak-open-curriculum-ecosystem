/**
 * Integration tests for benchmark query runner.
 *
 * Tests the query execution and metric calculation logic
 * using injected retrieval-service responses.
 */

import { describe, it, expect, vi } from 'vitest';
import { err, ok } from '@oaknational/result';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { LessonsSearchResult, LessonResult } from '@oaknational/oak-search-sdk/read';
import type { SearchLessonsIndexDoc } from '@oaknational/sdk-codegen/search';
import { runQuery, type RunQueryInput } from './benchmark-query-runner-lessons.js';

/** Create a minimal lesson index doc with just the slug. */
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

describe('runQuery', () => {
  /**
   * Creates a mock search function that returns specified slugs
   * in SDK LessonsSearchResult format.
   */
  function createMockSearch(slugs: readonly string[]) {
    const result: LessonsSearchResult = {
      scope: 'lessons',
      results: slugs.map(stubResult),
      total: slugs.length,
      took: 1,
      timedOut: false,
    };
    return vi.fn().mockResolvedValue(ok(result));
  }

  describe('category field', () => {
    it('should include category in QueryResult', async () => {
      const mockSearch = createMockSearch(['test-slug']);

      const input: RunQueryInput = {
        query: 'test query',
        expectedRelevance: { 'test-slug': 3 },
        subject: 'maths',
        phase: 'primary',
        category: 'cross-topic',
      };

      const result = await runQuery(input, mockSearch);

      // Result should include the category from input
      expect(result.category).toBe('cross-topic');
    });

    it('should preserve category through all query categories', async () => {
      const mockSearch = createMockSearch(['test-slug']);
      const categories: readonly QueryCategory[] = [
        'precise-topic',
        'natural-expression',
        'imprecise-input',
        'cross-topic',
      ];

      for (const category of categories) {
        const input: RunQueryInput = {
          query: 'test query',
          expectedRelevance: { 'test-slug': 3 },
          subject: 'maths',
          phase: 'primary',
          category,
        };

        const result = await runQuery(input, mockSearch);
        expect(result.category).toBe(category);
      }
    });
  });

  describe('cross-subject queries', () => {
    it('should omit subject from SDK params when subject is undefined', async () => {
      const mockSearch = createMockSearch(['relevant-slug']);

      const input: RunQueryInput = {
        query: 'apple',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: undefined,
        phase: undefined,
        category: 'basic',
      };

      await runQuery(input, mockSearch);

      expect(mockSearch).toHaveBeenCalledOnce();
      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'apple', size: 10 }),
      );
      expect(mockSearch.mock.calls[0]?.[0]).not.toHaveProperty('subject');
    });

    it('should throw when SDK search returns an error result', async () => {
      const mockSearch = vi.fn().mockResolvedValue(
        err({
          type: 'es_error',
          message: 'Search unavailable',
        }),
      );

      const input: RunQueryInput = {
        query: 'apple',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: undefined,
        phase: undefined,
        category: 'basic',
      };

      await expect(runQuery(input, mockSearch)).rejects.toThrow(
        'Benchmark search failed for query "apple": es_error: Search unavailable',
      );
    });
  });

  describe('result metrics and request construction', () => {
    it('returns expected metrics and result shape for deterministic results', async () => {
      const mockSearch = createMockSearch(['relevant-slug', 'other-slug']);
      const expectedRelevance = { 'relevant-slug': 3 };
      const input: RunQueryInput = {
        query: 'apple tree',
        expectedRelevance,
        subject: 'maths',
        phase: 'secondary',
        queryKeyStage: 'ks4',
        category: 'precise-topic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.mrr).toBe(1);
      expect(result.ndcg10).toBe(1);
      expect(result.precision3).toBeCloseTo(1 / 3);
      expect(result.recall10).toBe(1);
      expect(result.hasHit).toBe(true);
      expect(result.actualResults).toEqual(['relevant-slug', 'other-slug']);
      expect(result.expectedRelevance).toEqual(expectedRelevance);
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);

      expect(mockSearch).toHaveBeenCalledWith({
        query: 'apple tree',
        subject: 'maths',
        keyStage: 'ks4',
        size: 10,
      });
    });

    it('returns zeroed hit metrics for empty result sets', async () => {
      const mockSearch = createMockSearch([]);
      const expectedRelevance = { 'relevant-slug': 3 };
      const input: RunQueryInput = {
        query: 'empty query',
        expectedRelevance,
        subject: 'maths',
        phase: 'primary',
        category: 'precise-topic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.actualResults).toEqual([]);
      expect(result.hasHit).toBe(false);
      expect(result.mrr).toBe(0);
      expect(result.ndcg10).toBe(0);
      expect(result.precision3).toBe(0);
      expect(result.recall10).toBe(0);
    });
  });
});
