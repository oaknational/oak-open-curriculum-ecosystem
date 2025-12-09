import { describe, expect, it } from 'vitest';
import { calculateMRR, calculateNDCG } from './metrics';

describe('calculateMRR', () => {
  it('returns 1.0 when first result is relevant', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-a': 3, 'slug-b': 2 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBe(1.0);
  });

  it('returns 0.5 when second result is relevant', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-b': 3 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBe(0.5);
  });

  it('returns 0.333... when third result is relevant', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-c': 2 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBeCloseTo(1 / 3);
  });

  it('returns 0 when no results are relevant', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-d': 3 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBe(0);
  });

  it('returns 0 for empty results', () => {
    const results: string[] = [];
    const relevance = { 'slug-a': 3 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBe(0);
  });

  it('treats relevance score 1 as not relevant for MRR', () => {
    const results = ['slug-a', 'slug-b'];
    const relevance = { 'slug-a': 1, 'slug-b': 2 };

    const mrr = calculateMRR(results, relevance);

    expect(mrr).toBe(0.5); // slug-b is first relevant (score >= 2)
  });
});

describe('calculateNDCG', () => {
  it('returns 1.0 for perfectly ranked results', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-a': 3, 'slug-b': 2, 'slug-c': 1 };

    const ndcg = calculateNDCG(results, relevance, 3);

    expect(ndcg).toBe(1.0);
  });

  it('returns less than 1.0 for imperfect ranking', () => {
    const results = ['slug-b', 'slug-a', 'slug-c']; // Suboptimal order
    const relevance = { 'slug-a': 3, 'slug-b': 2, 'slug-c': 1 };

    const ndcg = calculateNDCG(results, relevance, 3);

    expect(ndcg).toBeLessThan(1.0);
    expect(ndcg).toBeGreaterThan(0);
  });

  it('returns 0 when no results are relevant', () => {
    const results = ['slug-a', 'slug-b', 'slug-c'];
    const relevance = { 'slug-d': 3 };

    const ndcg = calculateNDCG(results, relevance, 3);

    expect(ndcg).toBe(0);
  });

  it('handles graded relevance correctly', () => {
    // Best result (score 3) at position 1 is better than at position 2
    const results1 = ['slug-a', 'slug-b'];
    const results2 = ['slug-b', 'slug-a'];
    const relevance = { 'slug-a': 3, 'slug-b': 1 };

    const ndcg1 = calculateNDCG(results1, relevance, 2);
    const ndcg2 = calculateNDCG(results2, relevance, 2);

    expect(ndcg1).toBeGreaterThan(ndcg2);
  });

  it('respects the k parameter', () => {
    const results = ['slug-a', 'slug-b', 'slug-c', 'slug-d', 'slug-e'];
    const relevance = { 'slug-e': 3 }; // Only 5th result is relevant

    const ndcgAt3 = calculateNDCG(results, relevance, 3);
    const ndcgAt5 = calculateNDCG(results, relevance, 5);

    expect(ndcgAt3).toBe(0); // Relevant result outside top 3
    expect(ndcgAt5).toBeGreaterThan(0); // Relevant result within top 5
  });

  it('returns 0 for empty results', () => {
    const results: string[] = [];
    const relevance = { 'slug-a': 3 };

    const ndcg = calculateNDCG(results, relevance, 10);

    expect(ndcg).toBe(0);
  });

  it('handles empty relevance judgments', () => {
    const results = ['slug-a', 'slug-b'];
    const relevance: Record<string, number> = {};

    const ndcg = calculateNDCG(results, relevance, 2);

    expect(ndcg).toBe(0);
  });
});
