/**
 * Unit tests for baseline runner.
 *
 * Tests the pure functions that process ground truth queries and
 * calculate per-query baseline metrics.
 *
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import {
  processQueryResult,
  calculateCategoryMrr,
  type QueryBaselineResult,
} from './baseline-runner.js';
import type { GroundTruthQuery, QueryCategory } from './ground-truth/types.js';

describe('processQueryResult', () => {
  it('calculates correct MRR when first result is relevant', () => {
    const query: GroundTruthQuery = {
      query: 'solving equations',
      expectedRelevance: {
        'solving-simple-linear-equations': 3,
        'solving-equations-involving-functions': 2,
      },
      category: 'naturalistic',
      priority: 'high',
    };

    const actualResults = [
      'solving-simple-linear-equations', // rank 1, relevance 3
      'other-lesson',
      'solving-equations-involving-functions', // rank 3, relevance 2
    ];

    const result = processQueryResult(query, actualResults, 150);

    expect(result.query).toBe('solving equations');
    expect(result.category).toBe('naturalistic');
    expect(result.priority).toBe('high');
    expect(result.firstRelevantRank).toBe(1);
    expect(result.mrr).toBe(1); // 1/1
    expect(result.actualTop10).toEqual(actualResults);
    expect(result.latencyMs).toBe(150);
  });

  it('calculates correct MRR when relevant result is at position 3', () => {
    const query: GroundTruthQuery = {
      query: 'linear equations',
      expectedRelevance: {
        'solving-simple-linear-equations': 3,
      },
      category: 'misspelling',
      priority: 'critical',
    };

    const actualResults = [
      'unrelated-lesson-1',
      'unrelated-lesson-2',
      'solving-simple-linear-equations', // rank 3, relevance 3
      'unrelated-lesson-3',
    ];

    const result = processQueryResult(query, actualResults, 200);

    expect(result.firstRelevantRank).toBe(3);
    expect(result.mrr).toBeCloseTo(1 / 3, 5);
  });

  it('returns null rank and 0 MRR when no relevant result in top 10', () => {
    const query: GroundTruthQuery = {
      query: 'complex query',
      expectedRelevance: {
        'expected-lesson': 3,
      },
      category: 'intent-based',
      priority: 'exploratory',
    };

    const actualResults = [
      'unrelated-1',
      'unrelated-2',
      'unrelated-3',
      'unrelated-4',
      'unrelated-5',
      'unrelated-6',
      'unrelated-7',
      'unrelated-8',
      'unrelated-9',
      'unrelated-10',
    ];

    const result = processQueryResult(query, actualResults, 300);

    expect(result.firstRelevantRank).toBeNull();
    expect(result.mrr).toBe(0);
  });

  it('uses default category and priority when not provided', () => {
    const query: GroundTruthQuery = {
      query: 'simple query',
      expectedRelevance: { 'some-lesson': 2 },
    };

    const result = processQueryResult(query, ['some-lesson'], 100);

    expect(result.category).toBe('naturalistic');
    expect(result.priority).toBe('medium');
  });
});

describe('calculateCategoryMrr', () => {
  it('calculates average MRR for a category', () => {
    const results: readonly QueryBaselineResult[] = [
      createResult('naturalistic', 1.0),
      createResult('naturalistic', 0.5),
      createResult('naturalistic', 0.333),
      createResult('misspelling', 0.25),
    ];

    const categoryMrr = calculateCategoryMrr(results, 'naturalistic');

    // (1.0 + 0.5 + 0.333) / 3 ≈ 0.611
    expect(categoryMrr).toBeCloseTo((1.0 + 0.5 + 0.333) / 3, 3);
  });

  it('returns 0 when no results for category', () => {
    const results: readonly QueryBaselineResult[] = [createResult('naturalistic', 1.0)];

    const categoryMrr = calculateCategoryMrr(results, 'misspelling');

    expect(categoryMrr).toBe(0);
  });
});

/**
 * Helper to create a minimal QueryBaselineResult for testing.
 */
function createResult(category: QueryCategory, mrr: number): QueryBaselineResult {
  return {
    query: 'test query',
    category,
    priority: 'medium',
    expectedSlugs: [],
    actualTop10: [],
    firstRelevantRank: mrr > 0 ? Math.round(1 / mrr) : null,
    mrr,
    ndcg10: 0,
    latencyMs: 100,
  };
}
