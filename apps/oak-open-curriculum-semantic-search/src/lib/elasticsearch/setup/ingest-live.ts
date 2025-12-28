#!/usr/bin/env npx tsx
/**
 * Live data ingestion CLI entry point. Orchestrates the ingestion
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
import { createIngestHarness } from '../../indexing/ingest-harness.js';
import {
  getIngestionErrorCollector,
  resetIngestionErrorCollector,
} from '../../indexing/ingestion-error-collector.js';
import { ingestLogger, setLogLevel, enableFileSink, disableFileSink } from '../../logger';
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
import { withRateLimitMonitoring } from '../../rate-limit-logger.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

/** Load environment variables from .env.local. */
function initEnv(): boolean {
  const envResult = loadAppEnv(CURRENT_DIR);
  if (!envResult.loaded) {
    ingestLogger.error('Environment not loaded', { appRoot: envResult.appRoot });
    process.exitCode = 1;
    return false;
  }
  ingestLogger.debug('Environment loaded', { path: envResult.path });
  return true;
}

/** Handle cache clearing if requested. */
async function handleCacheClearing(args: CliArgs): Promise<void> {
  if (args.clearCache) {
    ingestLogger.debug('Clearing SDK response cache');
    const deleted = await clearSdkCache();
    ingestLogger.debug('Cache cleared', { deletedEntries: deleted });
  }
}

/** Execute ingestion and return result with duration. */
async function executeIngestion(
  harness: ReturnType<typeof createIngestHarness> extends Promise<infer U> ? U : never,
  args: CliArgs,
): Promise<{ result: IngestionResult; duration: string }> {
  ingestLogger.info(args.dryRun ? 'Starting DRY RUN' : 'Starting LIVE ingestion', {
    dryRun: args.dryRun,
    note: 'This may take several minutes - fetching data from Oak API',
  });

  const startTime = Date.now();
  const result = await harness.ingest({ dryRun: args.dryRun, verbose: args.verbose });
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  ingestLogger.debug('Ingestion phase complete', { durationSeconds: duration });
  return { result, duration };
}

/** Handle post-ingestion metadata write and error reporting. */
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
    ingestLogger.error('FATAL: Metadata write failed', {
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
  resetIngestionErrorCollector();
  printHeader(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient();

  try {
    await withRateLimitMonitoring(client.rateLimitTracker, 30000, async () => {
      ingestLogger.debug('Creating ingestion harness', {
        subjects: args.subjects,
        keyStages: args.keyStages,
      });

      const harness = await createIngestHarness({
        client,
        keyStages: args.keyStages,
        subjects: args.subjects,
        indexes: args.indexes,
        target: 'primary',
        logger: ingestLogger,
      });
      ingestLogger.debug('Harness created successfully');

      const { result, duration } = await executeIngestion(harness, args);

      printSummary(result, duration);
      printCacheStats(client);

      const errorCollector = getIngestionErrorCollector();
      errorCollector.logSummary(ingestLogger);

      await handlePostIngestion(args, result, duration);
    });
  } finally {
    await client.disconnect();
  }
}

/**
 * Generates a timestamped log file path.
 *
 * @returns Log file path in format: logs/ingest-YYYYMMDD-HHMMSS.log
 */
function generateLogFilePath(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19);
  return `logs/ingest-${timestamp}.log`;
}

/** Main CLI entry point. */
async function main(): Promise<void> {
  if (!initEnv()) {
    return;
  }

  const args = parseArgs(process.argv.slice(2));

  if (args.verbose) {
    setLogLevel('DEBUG');
  }

  // Enable file logging for all ingestion runs
  const logFilePath = generateLogFilePath();
  const logPath = enableFileSink(logFilePath);
  if (logPath !== null) {
    ingestLogger.info('INGESTION_STARTED', {
      logFile: logPath,
      subjects: args.subjects.join(','),
      keyStages: args.keyStages.join(','),
    });
  }

  if (args.help) {
    printHelp();
    disableFileSink();
    return;
  }

  try {
    await runIngestion(args);
  } finally {
    // Ensure file sink is closed and flushed
    disableFileSink();
  }
}

main().catch((error: unknown) => {
  ingestLogger.error('FATAL ERROR - Ingestion terminated', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    phase: 'main',
  });
  process.exit(1);
});
