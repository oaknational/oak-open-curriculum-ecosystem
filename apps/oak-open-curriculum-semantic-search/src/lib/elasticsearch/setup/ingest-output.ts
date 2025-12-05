/**
 * @module ingest-output
 * @description Output formatting and metadata writing for live data ingestion.
 * Handles header, summary, and metadata persistence to Elasticsearch.
 */

import type { CliArgs } from './ingest-cli-args.js';
import type { CachedOakClient } from '../../../adapters/oak-adapter-cached.js';
import { esClient } from '../../es-client.js';
import { writeIndexMeta, generateVersionFromTimestamp } from '../index-meta.js';
import { sandboxLogger } from '../../logger';

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

/** Write index metadata to Elasticsearch. */
export async function writeMetadata(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<void> {
  const version = generateVersionFromTimestamp();
  sandboxLogger.debug('Writing index metadata', { version });
  const client = esClient();
  await writeIndexMeta(client, {
    version,
    timestamp: new Date().toISOString(),
    docCounts: result.summary.counts,
    ingestionDuration: parseFloat(duration),
    subjects: args.subjects,
    keyStages: args.keyStages,
  });
  sandboxLogger.debug('Index metadata written successfully', { version });
}

/** Log dry run notice. */
export function printDryRunNotice(): void {
  sandboxLogger.info('Dry run complete', { action: 'No documents written to ES' });
}
