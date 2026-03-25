/**
 * Output formatting and metadata writing for live data ingestion.
 * Handles header, summary, and metadata persistence to Elasticsearch.
 * Uses `Result<T, E>` pattern for explicit error handling.
 */

import type { Result } from '@oaknational/result';
import { isErr } from '@oaknational/result';
import type { CliArgs } from './ingest-cli-args.js';
import type { OakClient } from '../../../adapters/oak-adapter.js';
import { esClient } from '../../es-client.js';
import { readIndexMeta, writeIndexMeta } from '../index-meta.js';
import type { IndexMetaError } from '../index-meta-types.js';
import { ingestLogger } from '../../logger';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';

/** Ingestion result with document counts. */
export interface IngestionResult {
  readonly summary: {
    readonly totalDocs: number;
    readonly counts: {
      readonly lessons: number;
      readonly units: number;
      readonly unit_rollup: number;
      readonly sequences: number;
      readonly sequence_facets: number;
    };
  };
}

function generateVersionFromTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toISOString().slice(11, 19).replace(/:/g, '');
  return `v${date}-${time}`;
}

/** Log header with ingestion configuration. */
export function printHeader(args: CliArgs): void {
  ingestLogger.info('Live Data Ingestion', {
    keyStages: args.keyStages,
    subjects: args.subjects,
    dryRun: args.dryRun,
  });
}

/** Log ingestion summary with document counts. */
export function printSummary(result: IngestionResult, duration: string): void {
  ingestLogger.info('Ingestion summary', {
    totalDocs: result.summary.totalDocs,
    lessons: result.summary.counts.lessons,
    units: result.summary.counts.units,
    unitRollups: result.summary.counts.unit_rollup,
    sequences: result.summary.counts.sequences,
    sequenceFacets: result.summary.counts.sequence_facets,
    durationSeconds: duration,
  });
}

/** Log cache statistics if caching was used. */
export function printCacheStats(client: OakClient): void {
  const stats = client.getCacheStats();
  if (stats.connected) {
    ingestLogger.info('Cache statistics', { hits: stats.hits, misses: stats.misses });
  }
}

/**
 * Write index metadata to Elasticsearch.
 * Returns `Result<void, IndexMetaError>` for explicit error handling.
 */
export async function writeMetadata(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<Result<void, IndexMetaError>> {
  const version = generateVersionFromTimestamp();
  ingestLogger.debug('Writing index metadata', { version });

  const client = esClient();
  const currentMetaResult = await readIndexMeta(client);
  if (isErr(currentMetaResult)) {
    return currentMetaResult;
  }

  const meta: IndexMetaDoc = {
    version,
    ingested_at: new Date().toISOString(),
    doc_counts: result.summary.counts,
    duration_ms: Math.round(parseFloat(duration) * 1000),
    subjects: args.subjects,
    key_stages: args.keyStages,
    previous_version: currentMetaResult.value?.version,
  };

  const writeResult = await writeIndexMeta(client, meta);

  if (isErr(writeResult)) {
    const error = writeResult.error;
    const errorMessage = error.type === 'not_found' ? 'Index metadata not found' : error.message;
    ingestLogger.error('Failed to write metadata', {
      errorType: error.type,
      message: errorMessage,
      version,
    });
    return writeResult;
  }

  ingestLogger.debug('Index metadata written successfully', { version });
  return writeResult;
}

/** Log dry run notice. */
export function printDryRunNotice(): void {
  ingestLogger.info('Dry run complete', { action: 'No documents written to ES' });
}

/**
 * Handle post-ingestion metadata write and error reporting.
 *
 * @param args - CLI arguments
 * @param result - Ingestion result
 * @param duration - Duration in seconds
 */
export async function handlePostIngestion(
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
