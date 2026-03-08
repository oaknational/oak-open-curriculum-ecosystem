/**
 * Unit tests for benchmark query runner.
 *
 * Tests the query execution and metric calculation logic
 * using mock SDK retrieval service responses.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok } from '@oaknational/result';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { LessonsSearchResult, LessonResult } from '@oaknational/oak-search-sdk';
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
    it('should include category in RunQueryInput', () => {
      // Type check: category should be accepted in input
      const input: RunQueryInput = {
        query: 'test query',
        expectedRelevance: { 'test-slug': 3 },
        subject: 'maths',
        phase: 'primary',
        category: 'precise-topic',
      };

      expect(input.category).toBe('precise-topic');
    });

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
    });

    it('should calculate metrics correctly for cross-subject queries', async () => {
      const mockSearch = createMockSearch(['relevant-slug', 'other-slug']);

      const input: RunQueryInput = {
        query: 'tree',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: undefined,
        phase: undefined,
        category: 'basic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.mrr).toBe(1);
      expect(result.hasHit).toBe(true);
    });
  });

  describe('metric calculation', () => {
    it('should calculate MRR correctly when first result is relevant', async () => {
      const mockSearch = createMockSearch(['relevant-slug', 'other-slug']);

      const input: RunQueryInput = {
        query: 'test query',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: 'maths',
        phase: 'primary',
        category: 'precise-topic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.mrr).toBe(1); // First result is relevant
      expect(result.hasHit).toBe(true);
    });

    it('should calculate MRR correctly when second result is relevant', async () => {
      const mockSearch = createMockSearch(['other-slug', 'relevant-slug']);

      const input: RunQueryInput = {
        query: 'test query',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: 'maths',
        phase: 'primary',
        category: 'precise-topic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.mrr).toBe(0.5); // Second result is relevant
      expect(result.hasHit).toBe(true);
    });

    it('should return zero MRR when no results are relevant', async () => {
      const mockSearch = createMockSearch(['other-slug-1', 'other-slug-2']);

      const input: RunQueryInput = {
        query: 'test query',
        expectedRelevance: { 'relevant-slug': 3 },
        subject: 'maths',
        phase: 'primary',
        category: 'precise-topic',
      };

      const result = await runQuery(input, mockSearch);

      expect(result.mrr).toBe(0);
      expect(result.hasHit).toBe(false);
    });
  });
});
