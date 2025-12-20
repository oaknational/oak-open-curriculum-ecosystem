/**
 * F-001: Synonym Coverage Smoke Test
 *
 * Tests that vocabulary gaps identified in B-001 are fixed by synonym expansion.
 * These tests will FAIL until synonyms are added to the SDK.
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **TDD Phase**: RED
 * - These tests are expected to FAIL before synonyms are added
 * - After adding synonyms to `maths.ts`, re-index, tests should PASS
 *
 * **Vocabulary Gaps Identified in B-001**:
 * | Query | Expected Match | Missing Synonym |
 * |-------|---------------|-----------------|
 * | "solving for x" | linear equations | solving for x → linear equations |
 * | "straight line graphs" | linear equations | straight line → linear |
 * | "rearrange formulas" | changing the subject | rearrange → change the subject |
 * | "sohcahtoa" | trigonometry | SOHCAHTOA → trigonometry |
 * | "rules for powers" | laws of indices | rules → laws |
 *
 * @see `.agent/evaluations/experiments/B-001-hard-query-baseline.experiment.md`
 * @see `.agent/evaluations/experiments/EXPERIMENT-PRIORITIES.md`
 */

import { describe, it, expect } from 'vitest';
import { esSearch } from '../src/lib/elastic-http.js';
import { buildLessonRrfRequest } from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc } from '../src/types/oak.js';

/**
 * Search lessons using 4-way hybrid and return slugs.
 */
async function searchLessons(query: string): Promise<readonly string[]> {
  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return response.hits.hits.map((hit) => hit._source.lesson_slug);
}

/**
 * Check if any of the expected slugs appear in the top N results.
 */
function hasExpectedInTopN(
  results: readonly string[],
  expectedSlugs: readonly string[],
  topN: number,
): boolean {
  const topResults = results.slice(0, topN);
  return expectedSlugs.some((slug) => topResults.some((r) => r.includes(slug)));
}

/**
 * Get the rank of the first matching expected slug (1-indexed).
 * Returns null if not found in results.
 */
function getRank(results: readonly string[], expectedSlugs: readonly string[]): number | null {
  for (let i = 0; i < results.length; i++) {
    if (expectedSlugs.some((slug) => results[i].includes(slug))) {
      return i + 1;
    }
  }
  return null;
}

describe('F-001: Synonym Coverage', () => {
  describe('Linear Equations Vocabulary', () => {
    it('"solving for x" finds linear equations lessons in top 3', async () => {
      const results = await searchLessons('solving for x');
      // Expected slugs based on actual Oak curriculum lesson slugs
      const expectedSlugs = [
        'linear-equations',
        'solving-simple-linear-equations',
        'solving-two-step-linear-equations',
        'solving-simultaneous-linear-equations',
      ];

      console.log('Query: "solving for x"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });

    it('"straight line graphs" finds linear graph lessons in top 3', async () => {
      const results = await searchLessons('straight line graphs');
      // Expected slugs based on actual Oak curriculum lesson slugs
      const expectedSlugs = ['straight-line', 'linear-graphs', 'equation-of-a-line', 'gradient'];

      console.log('Query: "straight line graphs"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });

  describe('Algebraic Manipulation Vocabulary', () => {
    it('"rearrange formulas" finds changing the subject lessons in top 3', async () => {
      const results = await searchLessons('rearrange formulas');
      const expectedSlugs = ['changing-the-subject'];

      console.log('Query: "rearrange formulas"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });

    it('"make x the subject" finds changing the subject lessons in top 3', async () => {
      const results = await searchLessons('make x the subject');
      const expectedSlugs = ['changing-the-subject'];

      console.log('Query: "make x the subject"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });

  describe('Trigonometry Vocabulary', () => {
    it('"sohcahtoa" finds trigonometry lessons in top 3', async () => {
      const results = await searchLessons('sohcahtoa');
      const expectedSlugs = [
        'applying-trigonometric-ratios',
        'introducing-tangent',
        'introducing-sine',
        'introducing-cosine',
        'trigonometry',
      ];

      console.log('Query: "sohcahtoa"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });

    it('"sin cos tan" finds trigonometry lessons in top 3', async () => {
      const results = await searchLessons('sin cos tan');
      const expectedSlugs = [
        'applying-trigonometric-ratios',
        'introducing-tangent',
        'introducing-sine',
        'introducing-cosine',
        'trigonometry',
      ];

      console.log('Query: "sin cos tan"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });

  describe('Index Laws Vocabulary', () => {
    it('"rules for powers" finds index laws lessons in top 3', async () => {
      const results = await searchLessons('rules for powers');
      const expectedSlugs = ['index-laws', 'laws-of-indices', 'combining-index-laws'];

      console.log('Query: "rules for powers"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });

    it('"exponent rules" finds index laws lessons in top 3', async () => {
      const results = await searchLessons('exponent rules');
      const expectedSlugs = ['index-laws', 'laws-of-indices', 'combining-index-laws'];

      console.log('Query: "exponent rules"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });

  describe('Quadratics Vocabulary', () => {
    /**
     * NOTE: "completing the square" lessons have null yearTitle in the curriculum data
     * and are not indexed in the KS4 filter. This test verifies that the query finds
     * semantically related quadratic content instead.
     */
    it('"completing the square" finds quadratic-related lessons in top 3', async () => {
      const results = await searchLessons('completing the square');
      // The specific completing-the-square lessons are not indexed for KS4
      // (they have null yearTitle). Check for semantically related quadratic content.
      const expectedSlugs = ['quadratic', 'factorising', 'expanding'];

      console.log('Query: "completing the square"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });

    it('"factoring quadratics" finds factorising lessons in top 3', async () => {
      const results = await searchLessons('factoring quadratics');
      const expectedSlugs = ['factorising', 'solving-quadratic-equations-by-factorising'];

      console.log('Query: "factoring quadratics"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });

  describe('Circle Theorems Vocabulary', () => {
    it('"circle rules" finds circle theorem lessons in top 3', async () => {
      const results = await searchLessons('circle rules');
      const expectedSlugs = ['circle-theorem', 'problem-solving-with-circle-theorems'];

      console.log('Query: "circle rules"');
      console.log('Top 5 results:', results.slice(0, 5));
      console.log('Expected slugs:', expectedSlugs);

      const rank = getRank(results, expectedSlugs);
      console.log('Rank of first match:', rank ?? 'Not in top 10');

      expect(
        hasExpectedInTopN(results, expectedSlugs, 3),
        `Expected one of [${expectedSlugs.join(', ')}] in top 3, got: ${results.slice(0, 3).join(', ')}`,
      ).toBe(true);
    });
  });
});
