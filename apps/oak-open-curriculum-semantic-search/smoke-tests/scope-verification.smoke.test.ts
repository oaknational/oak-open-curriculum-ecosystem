/**
 * Scope Verification Smoke Tests (Phase 3.0, Tasks 2-6)
 *
 * Verifies that multi-index search infrastructure works correctly:
 * - Lesson-only search returns only lessons
 * - Unit-only search returns only units
 * - Lesson filter by unit restricts results correctly
 *
 * **Classification**: SMOKE TEST
 * - Calls Elasticsearch directly (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 */

import { describe, it, expect } from 'vitest';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc } from '../src/types/oak.js';

/**
 * Search for lessons directly via the search library.
 *
 * @param query - Search query text
 * @param unitSlug - Optional unit slug filter
 * @returns Lesson results with slugs
 */
async function searchLessons(query: string, unitSlug?: string) {
  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
    unitSlug,
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
 * Search for units directly via the search library.
 *
 * @param query - Search query text
 * @returns Unit results with slugs
 */
async function searchUnits(query: string) {
  const request = buildUnitRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchUnitsIndexDoc>(request);
  return {
    total: response.hits.total.value,
    results: response.hits.hits.map((hit) => ({
      unit_slug: hit._source.unit_slug,
    })),
  };
}

describe('Scope Verification (Phase 3.0, Tasks 2-6)', () => {
  describe('Task 2: doc_type field verification', () => {
    it('lessons have lesson_slug field', async () => {
      const response = await searchLessons('quadratic equations');

      console.log('\nLesson doc_type verification:');
      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Expected lesson results').toBeGreaterThan(0);

      for (const result of response.results) {
        expect(result.lesson_slug, 'Lesson should have lesson_slug').toBeDefined();
      }

      console.log(`  ✓ All ${response.results.length} results are lessons`);
    });

    it('units have unit_slug field', async () => {
      const response = await searchUnits('algebra');

      console.log('\nUnit doc_type verification:');
      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Expected unit results').toBeGreaterThan(0);

      for (const result of response.results) {
        expect(result.unit_slug, 'Unit should have unit_slug').toBeDefined();
      }

      console.log(`  ✓ All ${response.results.length} results are units`);
    });
  });

  describe('Task 3: Lesson-only search verification', () => {
    it('returns only lessons when searching lessons scope', async () => {
      const response = await searchLessons('solving equations');

      console.log('\nLesson-only search verification:');
      console.log(`  Query: "solving equations"`);
      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Expected lesson results').toBeGreaterThan(0);

      for (const result of response.results) {
        expect(result.lesson_slug, 'Lesson should have lesson_slug').toBeDefined();
        expect(typeof result.lesson_slug).toBe('string');
      }

      const topResults = response.results.slice(0, 3).map((r) => r.lesson_slug);
      console.log(`  Top 3: ${topResults.join(', ')}`);
      console.log(`  ✓ All ${response.results.length} results are lessons`);
    });
  });

  describe('Task 4: Unit-only search verification', () => {
    it('returns only units when searching units scope', async () => {
      const response = await searchUnits('geometry');

      console.log('\nUnit-only search verification:');
      console.log(`  Query: "geometry"`);
      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Expected unit results').toBeGreaterThan(0);

      for (const result of response.results) {
        expect(result.unit_slug, 'Unit should have unit_slug').toBeDefined();
        expect(typeof result.unit_slug).toBe('string');
      }

      const topResults = response.results.slice(0, 3).map((r) => r.unit_slug);
      console.log(`  Top 3: ${topResults.join(', ')}`);
      console.log(`  ✓ All ${response.results.length} results are units`);
    });
  });

  describe('Task 6: Lesson filter by unit verification', () => {
    it('filters lessons to specified unit', async () => {
      // First, get a valid unit slug from unit search
      const unitResponse = await searchUnits('quadratic');
      expect(unitResponse.total, 'Need at least one unit for this test').toBeGreaterThan(0);

      const firstUnit = unitResponse.results[0];
      expect(firstUnit, 'First result should exist').toBeDefined();

      const unitSlug = firstUnit?.unit_slug;
      expect(unitSlug, 'Unit should have slug').toBeDefined();

      if (!unitSlug) {
        throw new Error('Could not get unit slug for filter test');
      }

      console.log('\nLesson filter by unit verification:');
      console.log(`  Unit filter: "${unitSlug}"`);

      // Search lessons filtered by this unit
      const response = await searchLessons('quadratic', unitSlug);

      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Expected filtered lesson results').toBeGreaterThan(0);

      for (const result of response.results) {
        expect(result.lesson_slug, 'Lesson should have lesson_slug').toBeDefined();
      }

      console.log(`  ✓ ${response.results.length} lessons returned for unit "${unitSlug}"`);

      // Compare with unfiltered search to verify filter restricts results
      const unfilteredResponse = await searchLessons('quadratic');
      expect(
        response.total,
        'Filtered results should be fewer than or equal to unfiltered results',
      ).toBeLessThanOrEqual(unfilteredResponse.total);

      console.log(`  ✓ Filtered (${response.total}) <= Unfiltered (${unfilteredResponse.total})`);
    });

    it('returns zero results for non-existent unit', async () => {
      const response = await searchLessons('equations', 'non-existent-unit-slug-xyz123');

      console.log('\nNon-existent unit filter verification:');
      console.log(`  Unit filter: "non-existent-unit-slug-xyz123"`);
      console.log(`  Total results: ${response.total}`);

      expect(response.total, 'Should return zero results for invalid unit').toBe(0);
      console.log('  ✓ Zero results returned for non-existent unit');
    });
  });
});
