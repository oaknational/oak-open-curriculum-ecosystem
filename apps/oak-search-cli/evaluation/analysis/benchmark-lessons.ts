/**
 * Production benchmark CLI.
 *
 * Wires the benchmark main logic to the Search SDK retrieval service,
 * ensuring benchmarks exercise the same code paths as production consumers.
 *
 * Usage: pnpm benchmark:lessons --all | --subject X --phase Y [--verbose]
 *
 * @see benchmark-main.ts - Core logic with dependency injection
 * @see benchmark-test-harness.ts - Test version with fake
 */
import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import { createCliSdk } from '../../src/cli/shared/create-cli-sdk.js';
import { env } from '../../src/lib/env.js';
import { runBenchmark } from './benchmark-main.js';

const sdk = createCliSdk(env());

runBenchmark(sdk.retrieval.searchLessons.bind(sdk.retrieval)).catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
