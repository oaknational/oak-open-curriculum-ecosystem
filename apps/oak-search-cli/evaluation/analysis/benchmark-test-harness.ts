/**
 * Test harness for benchmark E2E tests.
 *
 * Uses a simple fake search function that returns perfect matches.
 * This enables E2E testing of the benchmark CLI without network IO.
 *
 * @see benchmark-main.ts - Core logic with dependency injection
 * @see benchmark.ts - Production version with real ES
 * @see ADR-078 Dependency Injection for Testability
 */

import { ok } from '@oaknational/result';
import type { SearchFunction } from './benchmark-query-runner-lessons.js';
import type { LessonsSearchResult, LessonResult } from '@oaknational/oak-search-sdk';
import type { SearchLessonsIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';
import { runBenchmark } from './benchmark-main.js';

/** Create a minimal lesson index doc stub. */
function stubLessonDoc(slug: string): SearchLessonsIndexDoc {
  return {
    lesson_id: slug,
    lesson_slug: slug,
    lesson_title: `Fake: ${slug}`,
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

/**
 * Simple fake search function for E2E testing.
 *
 * Returns a fixed set of lesson slugs that will produce predictable metrics.
 * The slugs are designed to match common ground truth expectations.
 */
const fakeSearchAdapter: SearchFunction = () => {
  const fakeSlugs = [
    'adding-within-10-6',
    'subtracting-within-10-6',
    'counting-to-10',
    'number-bonds-to-10',
    'place-value-ones-and-tens',
  ];

  const result: LessonsSearchResult = {
    scope: 'lessons',
    results: fakeSlugs.map(stubResult),
    total: fakeSlugs.length,
    took: 1,
    timedOut: false,
  };

  return Promise.resolve(ok(result));
};

runBenchmark(fakeSearchAdapter).catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
