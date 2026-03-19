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
import { deriveSubjectSlugFromSequence } from '@oaknational/curriculum-sdk';
import type { OakClient } from '../../adapters/oak-adapter';
import { fetchCategoryMapForSequences } from '../../adapters/category-supplementation';
import type { BulkOperationEntry } from './bulk-operation-types';
import type { SearchIndexKind, IndexResolverFn } from '../search-index-target';
import { ingestLogger } from '../logger';
import { collectPhaseResults, type BulkProcessingAccumulator } from './bulk-ingestion-phases.js';
import { buildIngestionStats, type BulkIngestionStats } from './bulk-ingestion-stats.js';

export type { BulkIngestionStats, BulkProcessingAccumulator };

/** Result from bulk ingestion preparation. */
export interface BulkIngestionResult {
  readonly operations: BulkOperationEntry[];
  readonly stats: BulkIngestionStats;
}

/**
 * Options for bulk ingestion.
 *
 * @param resolveIndex - Optional index name resolver. When omitted, primary
 *   (non-versioned) index names are used. Pass a versioned resolver to target
 *   blue/green lifecycle indexes.
 */
export interface BulkIngestionOptions {
  readonly bulkDir: string;
  readonly client: OakClient;
  readonly subjectFilter?: readonly string[];
  readonly indexes?: readonly SearchIndexKind[];

  readonly resolveIndex?: IndexResolverFn;
}

/** Dependency surface for `prepareBulkIngestion` testability. */
export interface BulkIngestionDeps {
  readonly readAllBulkFiles: typeof readAllBulkFiles;
  readonly collectPhaseResults: typeof collectPhaseResults;
}

const defaultBulkIngestionDeps: BulkIngestionDeps = {
  readAllBulkFiles,
  collectPhaseResults,
};

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
    const subject = deriveSubjectSlugFromSequence(file.data.sequenceSlug);
    return filterSet.has(subject);
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
  deps: BulkIngestionDeps = defaultBulkIngestionDeps,
): Promise<BulkIngestionResult> {
  const { bulkDir, client, subjectFilter, indexes = [], resolveIndex } = options;
  ingestLogger.info('Starting bulk ingestion preparation', {
    bulkDir,
    indexes: indexes.length > 0 ? indexes : 'all',
  });

  const allFiles = await deps.readAllBulkFiles(bulkDir);
  const filteredFiles = filterBySubject(allFiles, subjectFilter);
  logFilesLoaded(allFiles.length, filteredFiles.length, subjectFilter);

  const bulkDownloadFiles = filteredFiles.map((f) => f.data);
  const sequenceSlugs = bulkDownloadFiles.map((f) => f.sequenceSlug);
  ingestLogger.info('Fetching category data for sequences', {
    sequenceCount: sequenceSlugs.length,
  });
  const categoryMap = await fetchCategoryMapForSequences(client, sequenceSlugs);
  ingestLogger.info('Category data fetched', {
    categoryMapSize: categoryMap.size,
  });

  const phases = await deps.collectPhaseResults(
    filteredFiles,
    bulkDownloadFiles,
    client,
    indexes,
    resolveIndex,
    categoryMap,
  );

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
