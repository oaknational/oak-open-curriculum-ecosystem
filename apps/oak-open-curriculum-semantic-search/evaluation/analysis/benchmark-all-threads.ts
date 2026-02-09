/**
 * Threads benchmark runner for the unified benchmark CLI.
 *
 * @packageDocumentation
 */

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchThreadIndexDoc } from '../../src/types/oak.js';
import { runThreadQuery, type ThreadSearchFunction } from './benchmark-query-runner-threads.js';
import { getThreadGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

const searchAdapter: ThreadSearchFunction = async (request) => {
  const response = await esSearch<SearchThreadIndexDoc>(request);
  return {
    hits: {
      hits: response.hits.hits.map((hit) => ({
        _source: { thread_slug: hit._source.thread_slug },
      })),
    },
  };
};

/** Run all thread ground truth queries and return summary metrics. */
export async function benchmarkThreads(): Promise<IndexResult> {
  const entries = getThreadGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    for (const query of entry.queries) {
      const result = await runThreadQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          category: query.category,
        },
        searchAdapter,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'threads', queries: results.length, metrics: averageMetrics(results) };
}
