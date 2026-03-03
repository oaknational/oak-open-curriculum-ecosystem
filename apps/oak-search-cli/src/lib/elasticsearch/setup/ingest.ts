/** Ingestion CLI — ingest curriculum data into Elasticsearch. */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from '../../../runtime-config.js';
import { initializeEsClient } from '../../es-client.js';
import { clearSdkCache } from '../../../adapters/oak-adapter.js';
import { createIngestHarness } from '../../indexing/ingest-harness.js';
import {
  getIngestionErrorCollector,
  resetIngestionErrorCollector,
} from '../../indexing/ingestion-error-collector.js';
import { ingestLogger, setLogLevel, enableFileSink, disableFileSink } from '../../logger';
import { parseArgs, type CliArgs } from './ingest-cli-args.js';
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
import { validateBulkDir } from './ingest-cli-validators.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

/** Handle cache clearing if requested. */
async function handleCacheClearing(
  args: CliArgs,
  env: Parameters<typeof clearSdkCache>[0],
): Promise<void> {
  if (args.clearCache) {
    ingestLogger.debug('Clearing SDK response cache');
    const deleted = await clearSdkCache(env);
    ingestLogger.debug('Cache cleared', { deletedEntries: deleted });
  }
}

/** Configure ingestion mode based on --incremental flag. */
function configureIngestionMode(args: CliArgs): void {
  const ingestionMode = args.incremental ? 'incremental' : 'force';
  setIngestionMode(ingestionMode);
  ingestLogger.info('Ingestion mode configured', {
    mode: ingestionMode,
    behavior: args.incremental
      ? 'skip existing documents (resumable)'
      : 'overwrite existing documents',
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

/**
 * Execute the main API-based ingestion workflow.
 *
 * @remarks
 * In dry-run mode, cache is bypassed to avoid Redis network IO.
 */
async function runApiIngestion(
  args: CliArgs,
  env: Parameters<typeof createIngestionClient>[0]['env'],
): Promise<void> {
  resetIngestionErrorCollector();
  printHeader(args);
  configureIngestionMode(args);
  await handleCacheClearing(args, env);

  // In dry-run mode, bypass cache to avoid Redis network IO
  const client = await createIngestionClient({
    env,
    bypassCache: args.bypassCache || args.dryRun,
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
        target: env.SEARCH_INDEX_TARGET ?? 'primary',
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
 * In dry-run mode, cache is bypassed to avoid network IO (Redis connection).
 * This enables E2E tests to verify CLI behavior without triggering network calls.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */
async function runBulkIngestion(
  args: CliArgs,
  env: Parameters<typeof createIngestionClient>[0]['env'],
): Promise<void> {
  resetIngestionErrorCollector();
  printBulkHeader(args);
  configureIngestionMode(args);
  await handleCacheClearing(args, env);

  // In dry-run mode, bypass cache to avoid Redis network IO
  const client = await createIngestionClient({
    env,
    bypassCache: args.bypassCache || args.dryRun,
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

/** Execute the main ingestion workflow (bulk by default, API with --api). */
async function runIngestion(
  args: CliArgs,
  env: Parameters<typeof createIngestionClient>[0]['env'],
): Promise<void> {
  if (args.api) {
    await runApiIngestion(args, env);
  } else {
    validateBulkDir(args.bulkDir);
    await runBulkIngestion(args, env);
  }
}

/** Main CLI entry point. */
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    // Commander already printed help, no runtime env setup required
    return;
  }

  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: CURRENT_DIR,
  });
  if (!configResult.ok) {
    process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
    process.exit(1);
  }
  const env = configResult.value.env;
  initializeEsClient(env);

  if (args.verbose) {
    setLogLevel('DEBUG');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19);
  const logPath = enableFileSink(`logs/ingest-${timestamp}.log`);
  if (logPath !== null) {
    ingestLogger.info('INGESTION_STARTED', {
      logFile: logPath,
      mode: args.api ? 'api' : 'bulk',
      ...(args.api
        ? { subjects: args.subjects.join(','), keyStages: args.keyStages.join(',') }
        : { bulkDir: args.bulkDir }),
    });
  }

  try {
    await runIngestion(args, env);
  } finally {
    // Ensure file sink is closed and flushed
    disableFileSink();
  }
}

main().catch((error: unknown) => {
  if (error instanceof CacheRequiredError) {
    ingestLogger.error('CACHE REQUIRED - Ingestion cannot proceed', error, {
      hint: 'Start Redis with: docker compose up -d, or use --bypass-cache',
    });
    process.exitCode = 1;
    return;
  }

  const fatalError = error instanceof Error ? error : new Error(String(error), { cause: error });
  ingestLogger.error('FATAL ERROR - Ingestion terminated', fatalError, { phase: 'main' });
  process.exitCode = 1;
});
