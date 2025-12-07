#!/usr/bin/env npx tsx
/**
 * @module ingest-live
 * @description Live data ingestion CLI entry point. Orchestrates the ingestion
 * of Oak curriculum data into Elasticsearch.
 *
 * Uses Result<T, E> pattern for explicit error handling and fail-fast behavior.
 *
 * Run with: pnpm es:ingest-live -- --subject history --keystage ks2
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isErr } from '@oaknational/result';
import { loadAppEnv } from './load-app-env.js';
import { clearSdkCache } from '../../../adapters/oak-adapter-cached.js';
import { createSandboxHarness } from '../../indexing/sandbox-harness.js';
import { sandboxLogger, setLogLevel } from '../../logger';
import { parseArgs, printHelp, type CliArgs } from './ingest-cli-args.js';
import { createIngestionClient } from './ingest-client-factory.js';
import type { IngestionResult } from './ingest-output.js';
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

/**
 * Execute ingestion and return result with duration.
 */
async function executeIngestion(
  harness: ReturnType<typeof createSandboxHarness> extends Promise<infer U> ? U : never,
  args: CliArgs,
): Promise<{ result: IngestionResult; duration: string }> {
  sandboxLogger.info(args.dryRun ? 'Starting DRY RUN' : 'Starting LIVE ingestion', {
    dryRun: args.dryRun,
    note: 'This may take several minutes - fetching data from Oak API',
  });

  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  sandboxLogger.debug('Ingestion phase complete', { durationSeconds: duration });
  return { result, duration };
}

/**
 * Handle post-ingestion metadata write and error reporting.
 */
async function handlePostIngestion(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<void> {
  if (args.dryRun) {
    printDryRunNotice();
    return;
  }

  const metadataResult = await writeMetadata(args, result, duration);

  if (isErr(metadataResult)) {
    const error = metadataResult.error;
    const errorMessage = error.type === 'not_found' ? 'Index metadata not found' : error.message;
    sandboxLogger.error('FATAL: Metadata write failed', {
      errorType: error.type,
      message: errorMessage,
      phase: 'post_ingestion',
      impact: 'Documents indexed but audit trail incomplete',
      ...(error.type === 'mapping_error' && { field: error.field }),
      ...(error.type === 'validation_error' && { details: error.details }),
    });

    process.exit(1);
  }
}

/** Execute the main ingestion workflow. */
async function runIngestion(args: CliArgs): Promise<void> {
  printHeader(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient();

  // Start rate limit monitoring
  const { logRateLimitStatus, startRateLimitMonitoring } =
    await import('../../rate-limit-logger.js');

  // Log initial rate limit status
  logRateLimitStatus(client.rateLimitTracker);

  // Start periodic monitoring (every 30 seconds)
  const stopMonitoring = startRateLimitMonitoring(client.rateLimitTracker, 30000);

  try {
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

    const { result, duration } = await executeIngestion(harness, args);

    printSummary(result, duration);
    printCacheStats(client);

    // Log final rate limit status
    sandboxLogger.info('Final API usage statistics');
    logRateLimitStatus(client.rateLimitTracker);

    await handlePostIngestion(args, result, duration);
  } finally {
    stopMonitoring();
    await client.disconnect();
  }
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
  sandboxLogger.error('FATAL ERROR - Ingestion terminated', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    phase: 'main',
  });
  // Fail fast - exit immediately
  process.exit(1);
});
