/**
 * Sequences benchmark runner for the unified benchmark CLI.
 *
 * Uses the Search SDK retrieval service, ensuring benchmarks exercise
 * the same code paths as production consumers.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCliSdk } from '../../src/cli/shared/create-cli-sdk.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { isSubject } from '@oaknational/curriculum-sdk';
import { runSequenceQuery } from './benchmark-query-runner-sequences.js';
import { getSequenceGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

/** Run all sequence ground truth queries and return summary metrics. */
export async function benchmarkSequences(): Promise<IndexResult> {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    throw new Error(`Environment validation failed: ${configResult.error.message}`);
  }
  const sdk = createCliSdk(configResult.value.env);
  const searchFn = sdk.retrieval.searchSequences.bind(sdk.retrieval);
  const entries = getSequenceGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    if (entry.subject === undefined || entry.phase === undefined) {
      console.warn(`  \u26A0 Skipping cross-subject entry (sequences require subject + phase)`);
      continue;
    }

    if (!isSubject(entry.subject)) {
      console.warn(`  \u26A0 Skipping: subject "${entry.subject}" is not a valid sequence subject`);
      continue;
    }

    for (const query of entry.queries) {
      const result = await runSequenceQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          category: query.category,
        },
        searchFn,
      );
      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`    ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      results.push(result);
    }
  }

  return { index: 'sequences', queries: results.length, metrics: averageMetrics(results) };
}
