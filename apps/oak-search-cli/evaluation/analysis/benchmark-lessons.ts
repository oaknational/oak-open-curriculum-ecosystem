/**
 * Production benchmark CLI.
 *
 * Wires the benchmark main logic to the Search SDK retrieval service,
 * ensuring benchmarks exercise the same code paths as production consumers.
 *
 * Usage: pnpm benchmark:lessons --all | --subject X --phase Y [--verbose]
 *
 * @see benchmark-main.ts - Core logic with dependency injection
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { withEvaluationSearchSdk } from './create-evaluation-search-sdk.js';
import { runBenchmark } from './benchmark-main.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const configResult = loadRuntimeConfig({
  processEnv: process.env,
  startDir: CURRENT_DIR,
});
if (!configResult.ok) {
  console.error('Environment validation failed:', configResult.error.message);
  process.exit(1);
}
withEvaluationSearchSdk(configResult.value.env, async (retrieval) => {
  await runBenchmark(retrieval.searchLessons.bind(retrieval));
}).catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
