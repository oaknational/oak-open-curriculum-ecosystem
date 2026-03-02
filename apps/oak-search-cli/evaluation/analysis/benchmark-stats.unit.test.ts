/**
 * Unit tests for benchmark statistics functions.
 */

import { describe, it, expect } from 'vitest';
import type { QueryResult } from './benchmark-query-runner-lessons.js';
import { aggregateByCategory } from './benchmark-stats.js';

describe('aggregateByCategory', () => {
  /**
   * Creates a mock QueryResult for testing.
   */
  function createResult(
    category: QueryResult['category'],
    mrr: number,
    hasHit: boolean,
    latencyMs = 100,
  ): QueryResult {
    return {
      category,
      mrr,
      ndcg10: mrr * 0.9, // Simplified for testing
      precision3: mrr * 0.2,
      recall10: mrr * 0.8,
      latencyMs,
      hasHit,
      actualResults: [], // Not used by aggregateByCategory
      expectedRelevance: {}, // Not used by aggregateByCategory
    };
  }

  it('should return empty array for empty input', () => {
    const result = aggregateByCategory([]);
    expect(result).toEqual([]);
  });

  it('should aggregate single category correctly', () => {
    const results: QueryResult[] = [
      createResult('precise-topic', 1.0, true, 100),
      createResult('precise-topic', 0.5, true, 200),
    ];

    const aggregated = aggregateByCategory(results);

    expect(aggregated).toHaveLength(1);
    expect(aggregated[0]?.category).toBe('precise-topic');
    expect(aggregated[0]?.queryCount).toBe(2);
    expect(aggregated[0]?.mrr).toBe(0.75); // (1.0 + 0.5) / 2
    expect(aggregated[0]?.zeroHitRate).toBe(0); // Both have hits
  });

  it('should aggregate multiple categories correctly', () => {
    const results: QueryResult[] = [
      createResult('precise-topic', 1.0, true),
      createResult('precise-topic', 0.5, true),
      createResult('imprecise-input', 0.8, true),
      createResult('cross-topic', 0.0, false),
    ];

    const aggregated = aggregateByCategory(results);

    expect(aggregated).toHaveLength(3);

    // Results should be sorted alphabetically by category
    expect(aggregated[0]?.category).toBe('cross-topic');
    expect(aggregated[1]?.category).toBe('imprecise-input');
    expect(aggregated[2]?.category).toBe('precise-topic');
  });

  it('should calculate zero-hit rate correctly', () => {
    const results: QueryResult[] = [
      createResult('precise-topic', 1.0, true),
      createResult('precise-topic', 0.0, false),
      createResult('precise-topic', 0.5, true),
      createResult('precise-topic', 0.0, false),
    ];

    const aggregated = aggregateByCategory(results);

    expect(aggregated[0]?.zeroHitRate).toBe(0.5); // 2 out of 4 have no hits
  });

  it('should calculate p95 latency correctly', () => {
    const results: QueryResult[] = [
      createResult('precise-topic', 1.0, true, 100),
      createResult('precise-topic', 1.0, true, 200),
      createResult('precise-topic', 1.0, true, 300),
      createResult('precise-topic', 1.0, true, 400),
      createResult('precise-topic', 1.0, true, 500),
      createResult('precise-topic', 1.0, true, 600),
      createResult('precise-topic', 1.0, true, 700),
      createResult('precise-topic', 1.0, true, 800),
      createResult('precise-topic', 1.0, true, 900),
      createResult('precise-topic', 1.0, true, 1000),
    ];

    const aggregated = aggregateByCategory(results);

    // p95 of [100, 200, ..., 1000] should be around 950-1000
    expect(aggregated[0]?.p95LatencyMs).toBeGreaterThanOrEqual(900);
    expect(aggregated[0]?.p95LatencyMs).toBeLessThanOrEqual(1000);
  });

  it('should include all required categories', () => {
    const results: QueryResult[] = [
      createResult('precise-topic', 1.0, true),
      createResult('natural-expression', 0.8, true),
      createResult('imprecise-input', 0.6, true),
      createResult('cross-topic', 0.4, true),
    ];

    const aggregated = aggregateByCategory(results);

    expect(aggregated).toHaveLength(4);
    const categories = aggregated.map((r) => r.category);
    expect(categories).toContain('precise-topic');
    expect(categories).toContain('natural-expression');
    expect(categories).toContain('imprecise-input');
    expect(categories).toContain('cross-topic');
  });
});
