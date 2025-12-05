#!/usr/bin/env npx tsx
/**
 * @module ingest-live
 * @description Live data ingestion CLI entry point. Orchestrates the ingestion
 * of Oak curriculum data into Elasticsearch.
 *
 * Run with: pnpm es:ingest-live -- --subject history --keystage ks2
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { clearSdkCache } from '../../../adapters/oak-adapter-cached.js';
import { createSandboxHarness } from '../../indexing/sandbox-harness.js';
import { sandboxLogger } from '../../logger.js';
import { parseArgs, printHelp, type CliArgs } from './ingest-cli-args.js';
import { createIngestionClient } from './ingest-client-factory.js';
import {
  printHeader,
  printSummary,
  printCacheStats,
  printDryRunNotice,
  writeMetadata,
} from './ingest-output.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

/** CLI-friendly log helper for progress reporting. */
function cliLog(message: string): void {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${message}`);
}

/** Load environment variables from .env.local. */
function initEnv(): boolean {
  const envResult = loadAppEnv(CURRENT_DIR);
  if (!envResult.loaded) {
    console.error(`No .env.local found in ${envResult.appRoot}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`Loaded env from: ${envResult.path}\n`);
  return true;
}

/** Handle cache clearing if requested. */
async function handleCacheClearing(args: CliArgs): Promise<void> {
  if (args.clearCache) {
    cliLog('Clearing SDK response cache...');
    const deleted = await clearSdkCache();
    cliLog(`Cleared ${deleted} cached entries`);
  }
}

/** Execute the main ingestion workflow. */
async function runIngestion(args: CliArgs): Promise<void> {
  printHeader(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient();

  cliLog('Creating ingestion harness...');
  cliLog(`  Subjects: ${args.subjects.join(', ')}`);
  cliLog(`  Key stages: ${args.keyStages.join(', ')}`);

  const harness = await createSandboxHarness({
    client,
    keyStages: args.keyStages,
    subjects: args.subjects,
    target: 'primary',
    logger: sandboxLogger,
  });
  cliLog('Harness created successfully');

  cliLog(args.dryRun ? 'Starting DRY RUN (no ES writes)...' : 'Starting LIVE ingestion...');
  cliLog('This may take several minutes - fetching data from Oak API...\n');

  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  cliLog(`Ingestion phase complete in ${duration}s`);
  printSummary(result, duration);
  printCacheStats(client);

  if (args.dryRun) {
    printDryRunNotice();
  } else {
    await writeMetadata(args, result, duration);
  }

  await client.disconnect();
}

/** Main CLI entry point. */
async function main(): Promise<void> {
  if (!initEnv()) return;
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  await runIngestion(args);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exitCode = 1;
});
