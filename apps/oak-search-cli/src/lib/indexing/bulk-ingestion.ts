/**
 * Bulk-first ingestion orchestration for Elasticsearch.
 *
 * @remarks
 * Coordinates file loading, filtering, and phase dispatch. Processing
 * phases (curriculum, threads, sequences, vocabulary) live in
 * `bulk-ingestion-phases.ts`.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */
import { readAllBulkFiles, type BulkFileResult } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from '../../adapters/oak-adapter';
import type { BulkOperationEntry } from './bulk-operation-types';
import type { SearchIndexKind } from '../search-index-target';
import { ingestLogger } from '../logger';
import {
  collectPhaseResults,
  buildIngestionStats,
  type BulkIngestionStats,
  type BulkProcessingAccumulator,
} from './bulk-ingestion-phases.js';

export type { BulkIngestionStats, BulkProcessingAccumulator };

/** Result from bulk ingestion preparation. */
export interface BulkIngestionResult {
  readonly operations: BulkOperationEntry[];
  readonly stats: BulkIngestionStats;
}

/** Options for bulk ingestion. */
export interface BulkIngestionOptions {
  readonly bulkDir: string;
  readonly client: OakClient;
  readonly subjectFilter?: readonly string[];
  readonly indexes?: readonly SearchIndexKind[];
}

/** Filters bulk file results by subject if filter is provided. */
function filterBySubject(
  files: readonly BulkFileResult[],
  subjectFilter?: readonly string[],
): readonly BulkFileResult[] {
  if (!subjectFilter || subjectFilter.length === 0) {
    return files;
  }
  const filterSet = new Set(subjectFilter);
  return files.filter((file) => {
    const subject = file.data.sequenceSlug.split('-')[0];
    return subject !== undefined && filterSet.has(subject);
  });
}

/** Logs file loading details. */
function logFilesLoaded(total: number, filtered: number, filter?: readonly string[]): void {
  ingestLogger.debug('Bulk files loaded', {
    totalFiles: total,
    filteredFiles: filtered,
    subjectFilter: filter ?? 'all',
  });
}

/** Prepares bulk operations from bulk download files using HybridDataSource. */
export async function prepareBulkIngestion(
  options: BulkIngestionOptions,
): Promise<BulkIngestionResult> {
  const { bulkDir, client, subjectFilter, indexes = [] } = options;
  ingestLogger.info('Starting bulk ingestion preparation', {
    bulkDir,
    indexes: indexes.length > 0 ? indexes : 'all',
  });

  const allFiles = await readAllBulkFiles(bulkDir);
  const filteredFiles = filterBySubject(allFiles, subjectFilter);
  logFilesLoaded(allFiles.length, filteredFiles.length, subjectFilter);

  const bulkDownloadFiles = filteredFiles.map((f) => f.data);
  const phases = await collectPhaseResults(filteredFiles, bulkDownloadFiles, client, indexes);

  const stats = buildIngestionStats(
    filteredFiles.length,
    phases.processingResult,
    phases.threadCount,
    phases.sequenceResult,
    phases.vocabStats,
  );

  ingestLogger.info('Bulk ingestion preparation complete', {
    ...stats,
    totalOperations: phases.operations.length,
  });
  return { operations: phases.operations, stats };
}
