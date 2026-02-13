/**
 * Threads benchmark runner for the unified benchmark CLI.
 *
 * Uses the Search SDK retrieval service, ensuring benchmarks exercise
 * the same code paths as production consumers.
 */

import { createCliSdk } from '../../src/cli/shared/create-cli-sdk.js';
import { env } from '../../src/lib/env.js';
import { runThreadQuery } from './benchmark-query-runner-threads.js';
import { getThreadGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

/** Run all thread ground truth queries and return summary metrics. */
export async function benchmarkThreads(): Promise<IndexResult> {
  const sdk = createCliSdk(env());
  const searchFn = sdk.retrieval.searchThreads.bind(sdk.retrieval);
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
        searchFn,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'threads', queries: results.length, metrics: averageMetrics(results) };
}
