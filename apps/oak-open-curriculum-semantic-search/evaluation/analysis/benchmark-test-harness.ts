/**
 * Test harness for benchmark E2E tests.
 *
 * Uses a simple fake search function that returns perfect matches.
 * This enables E2E testing of the benchmark CLI without network IO.
 *
 * @see benchmark-main.ts - Core logic with dependency injection
 * @see benchmark.ts - Production version with real ES
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type { SearchFunction, SearchResponse } from './benchmark-query-runner-lessons.js';
import { runBenchmark } from './benchmark-main.js';

/**
 * Simple fake search function for E2E testing.
 *
 * Returns a fixed set of lesson slugs that will produce predictable metrics.
 * The slugs are designed to match common ground truth expectations.
 */
const fakeSearchAdapter: SearchFunction = (): Promise<SearchResponse> => {
  // Return slugs that appear in many ground truths to produce non-zero MRR
  const fakeSlugs = [
    'adding-within-10-6',
    'subtracting-within-10-6',
    'counting-to-10',
    'number-bonds-to-10',
    'place-value-ones-and-tens',
  ];

  return Promise.resolve({
    hits: {
      hits: fakeSlugs.map((slug) => ({
        _source: { lesson_slug: slug },
      })),
    },
  });
};

runBenchmark(fakeSearchAdapter).catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
