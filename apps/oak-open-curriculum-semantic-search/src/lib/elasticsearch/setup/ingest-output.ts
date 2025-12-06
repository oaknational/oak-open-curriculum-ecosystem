/**
 * @module ingest-output
 * @description Output formatting and metadata writing for live data ingestion.
 * Handles header, summary, and metadata persistence to Elasticsearch.
 * Uses Result<T, E> pattern for explicit error handling.
 */

import type { Result } from '@oaknational/result';
import { isErr } from '@oaknational/result';
import type { CliArgs } from './ingest-cli-args.js';
import type { CachedOakClient } from '../../../adapters/oak-adapter-cached.js';
import { esClient } from '../../es-client.js';
import {
  writeIndexMeta,
  generateVersionFromTimestamp,
  type IndexMetaError,
} from '../index-meta.js';
import { sandboxLogger } from '../../logger';
import type { IndexMetaDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';

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

/** Log header with ingestion configuration. */
export function printHeader(args: CliArgs): void {
  sandboxLogger.info('Live Data Ingestion', {
    keyStages: args.keyStages,
    subjects: args.subjects,
    dryRun: args.dryRun,
  });
}

/** Log ingestion summary with document counts. */
export function printSummary(result: IngestionResult, duration: string): void {
  sandboxLogger.info('Ingestion summary', {
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
export function printCacheStats(client: CachedOakClient): void {
  const stats = client.getCacheStats();
  if (stats.connected) {
    sandboxLogger.info('Cache statistics', { hits: stats.hits, misses: stats.misses });
  }
}

/**
 * Write index metadata to Elasticsearch.
 * Returns Result<void, IndexMetaError> for explicit error handling.
 */
export async function writeMetadata(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<Result<void, IndexMetaError>> {
  const version = generateVersionFromTimestamp();
  sandboxLogger.debug('Writing index metadata', { version });

  const client = esClient();
  const meta: IndexMetaDoc = {
    version,
    ingested_at: new Date().toISOString(),
    doc_counts: result.summary.counts,
    duration_ms: Math.round(parseFloat(duration) * 1000),
    subjects: args.subjects,
    key_stages: args.keyStages,
  };

  const writeResult = await writeIndexMeta(client, meta);

  if (isErr(writeResult)) {
    const error = writeResult.error;
    const errorMessage = error.type === 'not_found' ? 'Index metadata not found' : error.message;
    sandboxLogger.error('Failed to write metadata', {
      errorType: error.type,
      message: errorMessage,
      version,
    });
    return writeResult;
  }

  sandboxLogger.debug('Index metadata written successfully', { version });
  return writeResult;
}

/** Log dry run notice. */
export function printDryRunNotice(): void {
  sandboxLogger.info('Dry run complete', { action: 'No documents written to ES' });
}
