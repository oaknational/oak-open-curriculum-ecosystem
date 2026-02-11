/**
 * Noise Phrase Filtering Smoke Test (Phase B.4)
 *
 * Validates that noise phrase removal improves colloquial query performance.
 * Tests specific queries from the hard query baseline that should benefit
 * from noise filtering.
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.4
 */

import { describe, it, expect } from 'vitest';
import { esSearch } from '../src/lib/elastic-http.js';
import { buildLessonRrfRequest } from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc } from '../src/types/oak.js';

/**
 * Search lessons and return top result slugs.
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

describe('B.4: Noise Phrase Filtering', () => {
  describe('colloquial queries', () => {
    it('finds "complete the square" from "the bit where you complete the square"', async () => {
      const results = await searchLessons('the bit where you complete the square');
      const slugs = results.slice(0, 3);

      // Expected: completing-the-square should be in top 3
      expect(slugs).toContain('completing-the-square');
    }, 10000);

    it('finds trigonometry from "that sohcahtoa stuff for triangles"', async () => {
      const results = await searchLessons('that sohcahtoa stuff for triangles');
      const slugs = results.slice(0, 3);

      // Expected: trigonometry lessons should be in top 3
      const trigLessons = [
        'applying-trigonometric-ratios-in-context',
        'problem-solving-with-right-angled-trigonometry',
        'introducing-tangent-of-an-angle',
      ];

      const hasTrigLesson = trigLessons.some((lesson) => slugs.includes(lesson));
      expect(hasTrigLesson, `Expected one of ${trigLessons.join(', ')} in top 3`).toBe(true);
    }, 10000);
  });

  describe('naturalistic queries', () => {
    it('finds linear equations from "teach my students about solving for x"', async () => {
      const results = await searchLessons('teach my students about solving for x');
      const slugs = results.slice(0, 5);

      // Expected: solving-simple-linear-equations should be in top 5
      expect(slugs).toContain('solving-simple-linear-equations');
    }, 10000);

    it('finds angles from "lesson on working out missing angles in shapes"', async () => {
      const results = await searchLessons('lesson on working out missing angles in shapes');
      const slugs = results.slice(0, 5);

      // Expected: angles-in-polygons lessons should be in top 5
      const angleLessons = [
        'angles-in-polygons-investigating-exterior-angles',
        'angles-in-polygons-investigating-interior-angles',
        'problem-solving-with-angles',
      ];

      const hasAngleLesson = angleLessons.some((lesson) => slugs.includes(lesson));
      expect(hasAngleLesson, `Expected one of ${angleLessons.join(', ')} in top 5`).toBe(true);
    }, 10000);
  });

  describe('pedagogical intent queries', () => {
    it('finds algebra from "help with algebra homework"', async () => {
      const results = await searchLessons('help with algebra homework');
      const slugs = results.slice(0, 5);

      // Expected: algebra-related lessons in top 5
      const hasAlgebra = slugs.some((slug) => slug.includes('algebra'));
      expect(hasAlgebra, 'Expected algebra lesson in top 5').toBe(true);
    }, 10000);
  });
});
