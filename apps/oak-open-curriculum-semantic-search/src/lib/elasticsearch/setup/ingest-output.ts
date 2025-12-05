/**
 * @module ingest-output
 * @description Output formatting and metadata writing for live data ingestion.
 * Handles header, summary, and metadata persistence to Elasticsearch.
 */

import type { CliArgs } from './ingest-cli-args.js';
import type { CachedOakClient } from '../../../adapters/oak-adapter-cached.js';
import { esClient } from '../../es-client.js';
import { writeIndexMeta, generateVersionFromTimestamp } from '../index-meta.js';

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

/** Print header with ingestion configuration. */
export function printHeader(args: CliArgs): void {
  console.log('Live Data Ingestion');
  console.log('─'.repeat(50));
  console.log(`Key Stages: ${args.keyStages.join(', ')}`);
  console.log(`Subjects: ${args.subjects.join(', ')}`);
  console.log(`Dry Run: ${args.dryRun}`);
  console.log('─'.repeat(50));
  console.log('');
}

/** Print ingestion summary with document counts. */
export function printSummary(result: IngestionResult, duration: string): void {
  console.log('\n' + '─'.repeat(50));
  console.log('Summary:');
  console.log(`  Total documents: ${result.summary.totalDocs}`);
  console.log(`  Lessons: ${result.summary.counts.lessons}`);
  console.log(`  Units: ${result.summary.counts.units}`);
  console.log(`  Unit Rollups: ${result.summary.counts.unit_rollup}`);
  console.log(`  Sequences: ${result.summary.counts.sequences}`);
  console.log(`  Sequence Facets: ${result.summary.counts.sequence_facets}`);
  console.log(`  Duration: ${duration}s`);
}

/** Print cache statistics if caching was used. */
export function printCacheStats(client: CachedOakClient): void {
  const stats = client.getCacheStats();
  if (stats.connected) {
    console.log(`  Cache: ${stats.hits} hits, ${stats.misses} misses`);
  }
}

/** Write index metadata to Elasticsearch. */
export async function writeMetadata(
  args: CliArgs,
  result: IngestionResult,
  duration: string,
): Promise<void> {
  const version = generateVersionFromTimestamp();
  console.log(`\n  Writing index metadata (version: ${version})...`);
  const client = esClient();
  await writeIndexMeta(client, {
    version,
    timestamp: new Date().toISOString(),
    docCounts: result.summary.counts,
    ingestionDuration: parseFloat(duration),
    subjects: args.subjects,
    keyStages: args.keyStages,
  });
  console.log('  Index metadata written successfully.');
}

/** Print dry run notice. */
export function printDryRunNotice(): void {
  console.log('\n  (Dry run - no documents written to ES)');
}
