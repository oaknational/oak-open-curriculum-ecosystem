/**
 * Units benchmark runner for the unified benchmark CLI.
 *
 * Uses the Search SDK retrieval service, ensuring benchmarks exercise
 * the same code paths as production consumers.
 */

import { createCliSdk } from '../../src/cli/shared/create-cli-sdk.js';
import { env } from '../../src/lib/env.js';
import { runUnitQuery } from './benchmark-query-runner-units.js';
import { getUnitGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

/** Run all unit ground truth queries and return summary metrics. */
export async function benchmarkUnits(): Promise<IndexResult> {
  const sdk = createCliSdk(env());
  const searchFn = sdk.retrieval.searchUnits.bind(sdk.retrieval);
  const entries = getUnitGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    if (entry.subject === undefined || entry.phase === undefined) {
      console.warn(`  \u26A0 Skipping cross-subject entry (units require subject + phase)`);
      continue;
    }

    for (const query of entry.queries) {
      const result = await runUnitQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          queryKeyStage: query.keyStage,
          category: query.category,
        },
        searchFn,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'units', queries: results.length, metrics: averageMetrics(results) };
}
