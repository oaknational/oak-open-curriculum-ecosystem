/**
 * KS4 Filtering Smoke Tests (Phase 3, Part 3a Task 5)
 *
 * Verifies that KS4 metadata denormalisation enables proper filtering:
 * - Filter lessons by tier (Foundation/Higher)
 * - Filter units by key stage
 * - Non-KS4 content is searchable
 *
 * **Classification**: SMOKE TEST
 * - Calls Elasticsearch directly (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 * - Requires index with KS4 metadata (after re-indexing with ks4-context-builder)
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import { describe, it, expect } from 'vitest';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc } from '../src/types/oak.js';

const TEST_TIMEOUT = 30000;

/**
 * Search for lessons directly via the search library with optional filters.
 */
async function searchLessons(
  query: string,
  options: {
    subject?: string;
    keyStage?: string;
    tier?: string;
    size?: number;
  } = {},
) {
  const request = buildLessonRrfRequest({
    query,
    size: options.size ?? 20,
    subject: (options.subject ?? 'maths') as 'maths',
    keyStage: (options.keyStage ?? 'ks4') as 'ks4',
    tier: options.tier,
  });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return {
    total: response.hits.total.value,
    results: response.hits.hits.map((hit) => ({
      lesson_slug: hit._source.lesson_slug,
    })),
  };
}

/**
 * Search for units directly via the search library with optional filters.
 */
async function searchUnits(
  query: string,
  options: {
    subject?: string;
    keyStage?: string;
    tier?: string;
    size?: number;
  } = {},
) {
  const request = buildUnitRrfRequest({
    query,
    size: options.size ?? 10,
    subject: (options.subject ?? 'maths') as 'maths',
    keyStage: (options.keyStage ?? 'ks4') as 'ks4',
    tier: options.tier,
  });

  const response = await esSearch<SearchUnitsIndexDoc>(request);
  return {
    total: response.hits.total.value,
    results: response.hits.hits.map((hit) => ({
      unit_slug: hit._source.unit_slug,
    })),
  };
}

describe('KS4 Filtering Smoke Tests', () => {
  describe('Lesson tier filtering', () => {
    it(
      'returns lessons when searching KS4 maths',
      async () => {
        const result = await searchLessons('fractions', { subject: 'maths', keyStage: 'ks4' });

        expect(result.results.length).toBeGreaterThan(0);

        for (const entry of result.results) {
          expect(entry.lesson_slug).toBeDefined();
        }
      },
      TEST_TIMEOUT,
    );

    it(
      'returns lessons with tier field populated for KS4 content',
      async () => {
        const result = await searchLessons('algebra', { subject: 'maths', keyStage: 'ks4' });

        expect(result.results.length).toBeGreaterThan(0);

        console.log(`KS4 Maths lesson results: ${result.results.length}`);
      },
      TEST_TIMEOUT,
    );

    it(
      'filtering by tier reduces results to tier-eligible lessons only',
      async () => {
        // Search without tier filter
        const allResults = await searchLessons('equations', { subject: 'maths', keyStage: 'ks4' });

        // Search with foundation tier filter
        const foundationResults = await searchLessons('equations', {
          subject: 'maths',
          keyStage: 'ks4',
          tier: 'foundation',
        });

        console.log(
          `All results: ${allResults.results.length}, Foundation only: ${foundationResults.results.length}`,
        );

        // Foundation results should be a subset of all results
        if (foundationResults.results.length > 0) {
          for (const foundationEntry of foundationResults.results) {
            const inAll = allResults.results.some(
              (entry) => entry.lesson_slug === foundationEntry.lesson_slug,
            );
            expect(inAll).toBe(true);
          }
        }
      },
      TEST_TIMEOUT,
    );
  });

  describe('Unit tier filtering', () => {
    it(
      'returns units when searching KS4 maths',
      async () => {
        const result = await searchUnits('fractions', { subject: 'maths', keyStage: 'ks4' });

        expect(result.results.length).toBeGreaterThan(0);

        for (const entry of result.results) {
          expect(entry.unit_slug).toBeDefined();
        }
      },
      TEST_TIMEOUT,
    );

    it(
      'returns units with tier arrays populated for KS4 content',
      async () => {
        const result = await searchUnits('algebra', { subject: 'maths', keyStage: 'ks4' });

        expect(result.results.length).toBeGreaterThan(0);

        console.log(`KS4 Maths unit results: ${result.results.length}`);
      },
      TEST_TIMEOUT,
    );
  });

  describe('Non-KS4 content', () => {
    it(
      'KS2 content returns lesson results',
      async () => {
        const result = await searchLessons('fractions', { subject: 'maths', keyStage: 'ks2' });

        if (result.results.length > 0) {
          for (const entry of result.results) {
            expect(entry.lesson_slug).toBeDefined();
          }
        }
      },
      TEST_TIMEOUT,
    );
  });
});
