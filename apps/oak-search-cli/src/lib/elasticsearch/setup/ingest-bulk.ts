#!/usr/bin/env npx tsx
/**
 * Bulk-first ingestion module for the CLI.
 *
 * @remarks
 * Uses bulk download files as primary data source with API supplementation
 * for KS4 tier enrichment. Rate limiting applies only to API calls within
 * buildKs4SupplementationContext, not to bulk file I/O or ES dispatch.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @module lib/elasticsearch/setup/ingest-bulk
 */

import type { CliArgs } from './ingest-cli-args.js';
import type { OakClient } from '../../../adapters/oak-adapter.js';
import type { IngestionResult } from './ingest-output.js';
import { prepareBulkIngestion, type BulkIngestionStats } from '../../indexing/bulk-ingestion.js';
import { esClient } from '../../es-client.js';
import {
  dispatchBulk,
  summariseOperations,
  type BulkUploadConfig,
  type BulkUploadResult,
} from '../../indexing/ingest-harness-ops.js';
import { ingestLogger } from '../../logger';
import { printDryRunNotice, printCacheStats } from './ingest-output.js';
import { handleUploadComplete } from './ingest-failure-report.js';

/**
 * Log bulk ingestion summary with document counts.
 *
 * @param stats - Bulk ingestion statistics
 * @param duration - Duration in seconds as string
 */
export function printBulkSummary(stats: BulkIngestionStats, duration: string): void {
  ingestLogger.info('Bulk ingestion summary', {
    filesProcessed: stats.filesProcessed,
    lessons: stats.lessonsIndexed,
    units: stats.unitsIndexed,
    threads: stats.threadsIndexed,
    vocabulary: {
      uniqueKeywords: stats.vocabularyStats.uniqueKeywords,
      misconceptions: stats.vocabularyStats.totalMisconceptions,
      synonyms: stats.vocabularyStats.synonymsExtracted,
    },
    durationSeconds: duration,
  });
}

/** Log bulk ingestion header. */
export function printBulkHeader(args: CliArgs): void {
  ingestLogger.info('Bulk Ingestion', {
    bulkDir: args.bulkDir,
    dryRun: args.dryRun,
    incremental: args.incremental,
  });
}

/** Prepare bulk operations from bulk download files. */
async function prepareBulkOperations(
  bulkDir: string,
  client: OakClient,
): Promise<{
  operations: ReturnType<typeof prepareBulkIngestion> extends Promise<infer U> ? U : never;
}> {
  const result = await prepareBulkIngestion({ bulkDir, client });
  return { operations: result };
}

/**
 * Dispatch bulk operations to Elasticsearch.
 *
 * @param operations - Prepared bulk operations
 * @param config - Upload configuration (retry settings)
 * @returns Upload result with success count and any permanently failed operations
 */
async function dispatchOperations(
  operations: Awaited<ReturnType<typeof prepareBulkIngestion>>['operations'],
  config: BulkUploadConfig,
): Promise<BulkUploadResult> {
  const es = esClient();
  return dispatchBulk({ transport: es.transport }, operations, ingestLogger, config);
}

/** Log ingestion start with configuration details. */
function logIngestionStart(args: CliArgs): void {
  ingestLogger.info(args.dryRun ? 'Starting BULK DRY RUN' : 'Starting BULK LIVE ingestion', {
    dryRun: args.dryRun,
    note: 'Reading from bulk download files, API used only for KS4 tier enrichment',
    retryConfig: {
      documentRetryEnabled: !args.noRetry,
      maxRetries: args.maxRetries ?? 'default (3)',
      retryDelay: args.retryDelay ?? 'default (5000ms)',
    },
  });
}

/** Convert bulk stats to IngestionResult format. */
function createIngestionResult(
  operations: Awaited<ReturnType<typeof prepareBulkIngestion>>['operations'],
): IngestionResult {
  const summary = summariseOperations(operations, 'primary');
  return {
    summary: {
      totalDocs: summary.totalDocs,
      counts: {
        lessons: summary.counts.lessons,
        units: summary.counts.units,
        unit_rollup: summary.counts.unit_rollup,
        sequences: summary.counts.sequences,
        sequence_facets: summary.counts.sequence_facets,
      },
    },
  };
}

/** Bulk ingestion result with statistics and duration. */
export interface BulkIngestionExecutionResult {
  readonly stats: BulkIngestionStats;
  readonly duration: string;
  readonly result: IngestionResult;
}

/**
 * Creates BulkUploadConfig from CLI arguments.
 *
 * @param args - CLI arguments containing retry configuration
 * @returns BulkUploadConfig for dispatchBulk
 */
function createUploadConfig(args: CliArgs): BulkUploadConfig {
  return {
    documentRetryEnabled: !args.noRetry,
    documentMaxRetries: args.maxRetries,
    documentRetryDelayMs: args.retryDelay,
  };
}

/**
 * Execute bulk ingestion preparation and optionally dispatch to ES.
 *
 * @param args - CLI arguments
 * @param client - Oak client for API supplementation
 * @returns Bulk ingestion result with stats and duration
 */
export async function executeBulkIngestion(
  args: CliArgs,
  client: OakClient,
): Promise<BulkIngestionExecutionResult> {
  logIngestionStart(args);
  const startTime = Date.now();

  const bulkDir = args.bulkDir;
  if (bulkDir === undefined) {
    throw new Error('--bulk-dir is required for bulk mode');
  }

  const { operations: prepResult } = await prepareBulkOperations(bulkDir, client);
  const { operations, stats } = prepResult;
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  const summary = summariseOperations(operations, 'primary');
  ingestLogger.debug('Bulk operations prepared', {
    totalOperations: operations.length,
    totalDocs: summary.totalDocs,
    counts: summary.counts,
  });

  if (args.dryRun) {
    printBulkSummary(stats, duration);
    printDryRunNotice();
    printCacheStats(client);
    return { stats, duration, result: createIngestionResult(operations) };
  }

  const uploadResult = await dispatchOperations(operations, createUploadConfig(args));
  printBulkSummary(stats, duration);
  printCacheStats(client);
  handleUploadComplete(uploadResult, bulkDir);

  return { stats, duration, result: createIngestionResult(operations) };
}
