/**
 * Lessons benchmark runner for the unified benchmark CLI.
 *
 * Uses the Search SDK retrieval service, ensuring benchmarks exercise
 * the same code paths as production consumers.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCliSdk } from '../../src/cli/shared/create-cli-sdk.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { runQuery } from './benchmark-query-runner-lessons.js';
import { getLessonGroundTruthEntries } from './benchmark-adapters.js';
import type { IndexResult, BenchmarkMetrics } from './benchmark-all-types.js';
import { averageMetrics } from './benchmark-all-types.js';

/** Run all lesson ground truth queries and return summary metrics. */
export async function benchmarkLessons(): Promise<IndexResult> {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    throw new Error(`Environment validation failed: ${configResult.error.message}`);
  }
  const sdk = createCliSdk(configResult.value.env);
  const searchFn = sdk.retrieval.searchLessons.bind(sdk.retrieval);
  const entries = getLessonGroundTruthEntries();
  const results: BenchmarkMetrics[] = [];

  for (const entry of entries) {
    for (const query of entry.queries) {
      const result = await runQuery(
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

  return { index: 'lessons', queries: results.length, metrics: averageMetrics(results) };
}
