/**
 * Production benchmark CLI.
 *
 * Thin wrapper that wires the benchmark main logic to the real ES client.
 *
 * Usage: pnpm benchmark --all | --subject X --phase Y [--verbose]
 *
 * @see benchmark-main.ts - Core logic with dependency injection
 * @see benchmark-test-harness.ts - Test version with fake ES
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchLessonsIndexDoc } from '../../src/types/oak.js';
import type { SearchFunction } from './benchmark-query-runner.js';
import { runBenchmark } from './benchmark-main.js';

/**
 * Production search adapter.
 *
 * Wraps esSearch to match the SearchFunction type.
 */
const productionSearchAdapter: SearchFunction = async (request) => {
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return {
    hits: {
      hits: response.hits.hits.map((hit) => ({
        _source: { lesson_slug: hit._source.lesson_slug },
      })),
    },
  };
};

runBenchmark(productionSearchAdapter).catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
