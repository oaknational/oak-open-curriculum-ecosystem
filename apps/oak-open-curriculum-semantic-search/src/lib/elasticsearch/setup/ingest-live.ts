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
import { sandboxLogger, setLogLevel } from '../../logger';
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

/** Load environment variables from .env.local. */
function initEnv(): boolean {
  const envResult = loadAppEnv(CURRENT_DIR);
  if (!envResult.loaded) {
    sandboxLogger.error('Environment not loaded', { appRoot: envResult.appRoot });
    process.exitCode = 1;
    return false;
  }
  sandboxLogger.debug('Environment loaded', { path: envResult.path });
  return true;
}

/** Handle cache clearing if requested. */
async function handleCacheClearing(args: CliArgs): Promise<void> {
  if (args.clearCache) {
    sandboxLogger.debug('Clearing SDK response cache');
    const deleted = await clearSdkCache();
    sandboxLogger.debug('Cache cleared', { deletedEntries: deleted });
  }
}

/** Execute the main ingestion workflow. */
async function runIngestion(args: CliArgs): Promise<void> {
  printHeader(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient();

  sandboxLogger.debug('Creating ingestion harness', {
    subjects: args.subjects,
    keyStages: args.keyStages,
  });

  const harness = await createSandboxHarness({
    client,
    keyStages: args.keyStages,
    subjects: args.subjects,
    indexes: args.indexes,
    target: 'primary',
    logger: sandboxLogger,
  });
  sandboxLogger.debug('Harness created successfully');

  sandboxLogger.info(args.dryRun ? 'Starting DRY RUN' : 'Starting LIVE ingestion', {
    dryRun: args.dryRun,
    note: 'This may take several minutes - fetching data from Oak API',
  });

  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  sandboxLogger.debug('Ingestion phase complete', { durationSeconds: duration });
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
  if (!initEnv()) {
    return;
  }

  const args = parseArgs(process.argv.slice(2));

  // Wire verbose flag to log level
  if (args.verbose) {
    setLogLevel('DEBUG');
  }

  if (args.help) {
    printHelp();
    return;
  }

  await runIngestion(args);
}

main().catch((error: unknown) => {
  sandboxLogger.error('Fatal error', error instanceof Error ? error : undefined, {
    message: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
