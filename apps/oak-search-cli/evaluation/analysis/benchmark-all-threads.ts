/**
 * Threads benchmark runner for the unified benchmark CLI.
 *
 * Uses the Search SDK retrieval service, ensuring benchmarks exercise
 * the same code paths as production consumers.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { withEvaluationSearchSdk } from './create-evaluation-search-sdk.js';
import { runThreadQuery } from './benchmark-query-runner-threads.js';
import { getThreadGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

/** Run all thread ground truth queries and return summary metrics. */
export async function benchmarkThreads(): Promise<IndexResult> {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    throw new Error(`Environment validation failed: ${configResult.error.message}`);
  }
  return withEvaluationSearchSdk(configResult.value.env, async (retrieval) => {
    const searchFn = retrieval.searchThreads.bind(retrieval);
    const entries = getThreadGroundTruthEntries();
    const results: BenchmarkMetrics[] = [];

    for (const entry of entries) {
      if (entry.subject === undefined) {
        console.warn(`  \u26A0 Skipping cross-subject entry (threads require subject)`);
        continue;
      }

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
  });
}
