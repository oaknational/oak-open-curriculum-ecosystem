#!/usr/bin/env npx tsx
/**
 * Live data ingestion CLI - canonical way to ingest curriculum data into Elasticsearch.
 *
 * Supports two modes:
 * - API mode (default): `pnpm es:ingest-live --all --verbose`
 * - Bulk mode: `pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --verbose`
 *
 * @see operations/ingestion/README.md for full documentation
 * @see ADR-080, ADR-087, ADR-093 for architecture decisions
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from './load-app-env.js';
import { clearSdkCache } from '../../../adapters/oak-adapter.js';
import { createIngestHarness } from '../../indexing/ingest-harness.js';
import {
  getIngestionErrorCollector,
  resetIngestionErrorCollector,
} from '../../indexing/ingestion-error-collector.js';
import { ingestLogger, setLogLevel, enableFileSink, disableFileSink } from '../../logger';
import { parseArgs, printHelp, type CliArgs } from './ingest-cli-args.js';
import { createIngestionClient, CacheRequiredError } from './ingest-client-factory.js';
import { setIngestionMode } from '../../indexing/bulk-action-factory.js';
import type { IngestionResult } from './ingest-output.js';
import {
  printHeader,
  printSummary,
  printCacheStats,
  handlePostIngestion,
} from './ingest-output.js';
import { withRateLimitMonitoring } from '../../rate-limit-logger.js';
import { printBulkHeader, executeBulkIngestion } from './ingest-bulk.js';

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

/** Configure ingestion mode based on --force flag. */
function configureIngestionMode(args: CliArgs): void {
  const ingestionMode = args.force ? 'force' : 'incremental';
  setIngestionMode(ingestionMode);
  ingestLogger.info('Ingestion mode configured', {
    mode: ingestionMode,
    behavior: args.force ? 'overwrite existing documents' : 'skip existing documents (resumable)',
  });
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

/** Execute the main API-based ingestion workflow. */
async function runApiIngestion(args: CliArgs): Promise<void> {
  resetIngestionErrorCollector();
  printHeader(args);
  configureIngestionMode(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient({
    bypassCache: args.bypassCache,
    ignoreCached404: args.ignoreCached404,
  });

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
 * Execute bulk-first ingestion workflow.
 *
 * @remarks
 * Uses bulk download files as primary data source with API supplementation
 * for KS4 tier enrichment. Rate limiting applies only to API calls within
 * buildKs4SupplementationContext, not to bulk file I/O or ES dispatch.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */
async function runBulkIngestion(args: CliArgs): Promise<void> {
  resetIngestionErrorCollector();
  printBulkHeader(args);
  configureIngestionMode(args);
  await handleCacheClearing(args);

  const client = await createIngestionClient({
    bypassCache: args.bypassCache,
    ignoreCached404: args.ignoreCached404,
  });

  try {
    const { result, duration } = await executeBulkIngestion(args, client);
    if (!args.dryRun) {
      const errorCollector = getIngestionErrorCollector();
      errorCollector.logSummary(ingestLogger);
      await handlePostIngestion(args, result, duration);
    }
  } finally {
    await client.disconnect();
  }
}

/** Execute the main ingestion workflow (routes to API or bulk mode). */
async function runIngestion(args: CliArgs): Promise<void> {
  if (args.bulk) {
    await runBulkIngestion(args);
  } else {
    await runApiIngestion(args);
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
      mode: args.bulk ? 'bulk' : 'api',
      ...(args.bulk
        ? { bulkDir: args.bulkDir }
        : { subjects: args.subjects.join(','), keyStages: args.keyStages.join(',') }),
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
  // Provide clear message for cache requirement errors
  if (error instanceof CacheRequiredError) {
    ingestLogger.error('CACHE REQUIRED - Ingestion cannot proceed', {
      error: error.message,
      hint: 'Start Redis with: docker compose up -d, or use --bypass-cache',
    });
    process.exit(1);
  }

  ingestLogger.error('FATAL ERROR - Ingestion terminated', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    phase: 'main',
  });
  process.exit(1);
});
