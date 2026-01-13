/**
 * Unit tests for benchmark query runner.
 *
 * Tests the query execution and metric calculation logic.
 *
 * @packageDocumentation
 */

import { describe, it, expect, vi } from 'vitest';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth/types.js';
import { runQuery, type RunQueryInput, type SearchResponse } from './benchmark-query-runner.js';

describe('runQuery', () => {
  /**
   * Creates a mock search function that returns specified slugs.
   */
  function createMockSearch(slugs: readonly string[]) {
    return vi.fn().mockResolvedValue({
      hits: {
        hits: slugs.map((slug) => ({
          _source: { lesson_slug: slug },
        })),
      },
    } satisfies SearchResponse);
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
