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
import {
  excludeRestrictedLessons,
  readAllBulkFiles,
  type BulkFileResult,
} from '@oaknational/sdk-codegen/bulk';
import { deriveSubjectSlugFromSequence } from '@oaknational/curriculum-sdk';
import type { OakClient } from '../../adapters/oak-adapter';
import {
  fetchCategoryMapForSequences,
  type CategoryMap,
} from '../../adapters/category-supplementation';
import type { BulkOperationEntry } from './bulk-operation-types';
import type { SearchIndexKind, IndexResolverFn } from '../search-index-target';
import { ingestLogger } from '../logger';
import { collectPhaseResults } from './bulk-ingestion-phases.js';
import { buildIngestionStats, type BulkIngestionStats } from './bulk-ingestion-stats.js';

export type { BulkIngestionStats };

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

  /**
   * If true, retain restricted lessons in the index instead of excluding them.
   * Default (undefined/false) excludes, reproducing the standing behaviour —
   * the documented, configurable restricted-exclusion switch (owner ruling
   * 2026-08-12).
   */
  readonly includeRestricted?: boolean;
}

/**
 * Dependency surface for `prepareBulkIngestion` testability.
 *
 * @see ADR-078 Dependency Injection for Testability
 */
export interface BulkIngestionDeps {
  readonly readAllBulkFiles: typeof readAllBulkFiles;
  readonly collectPhaseResults: typeof collectPhaseResults;
  readonly fetchCategoryMapForSequences: typeof fetchCategoryMapForSequences;
}

const defaultBulkIngestionDeps: BulkIngestionDeps = {
  readAllBulkFiles,
  collectPhaseResults,
  fetchCategoryMapForSequences,
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

/**
 * Applies the restricted-lesson exclusion switch (default exclude; owner ruling
 * 2026-08-12, ADR-224) and reports the outcome. Provenance and revisit
 * condition live on the SDK's restricted-lesson-filter.
 */
function excludeRestrictedForIngest(
  files: readonly BulkFileResult[],
  includeRestricted: boolean | undefined,
): ReturnType<typeof excludeRestrictedLessons> {
  const result = excludeRestrictedLessons(files, { includeRestricted });
  ingestLogger.info('Restricted-lesson exclusion applied at ingest', {
    includeRestricted: includeRestricted === true,
    restrictedLessonsExcluded: result.restrictedLessonsExcluded,
    decision: 'MCP-204 filter-at-ingest, configurable (owner ruling 2026-08-12)',
  });
  return result;
}

/**
 * Fetches and unwraps category data at the orchestrator boundary.
 *
 * @remarks
 * Converts `Result.err` to a thrown error intentionally — callers of
 * `prepareBulkIngestion` receive an exception, not a Result, because
 * category fetch failure is unrecoverable for the ingestion run.
 */
async function fetchCategories(
  deps: BulkIngestionDeps,
  client: OakClient,
  sequenceSlugs: readonly string[],
): Promise<CategoryMap> {
  ingestLogger.info('Fetching category data for sequences', {
    sequenceCount: sequenceSlugs.length,
  });
  const categoryMapResult = await deps.fetchCategoryMapForSequences(client, sequenceSlugs);
  if (!categoryMapResult.ok) {
    throw categoryMapResult.error;
  }
  ingestLogger.info('Category data fetched', {
    categoryMapSize: categoryMapResult.value.size,
  });
  return categoryMapResult.value;
}

/** Prepares bulk operations from bulk download files using HybridDataSource. */
export async function prepareBulkIngestion(
  options: BulkIngestionOptions,
  deps: BulkIngestionDeps = defaultBulkIngestionDeps,
): Promise<BulkIngestionResult> {
  const { bulkDir, client, subjectFilter, indexes = [], resolveIndex, includeRestricted } = options;
  ingestLogger.info('Starting bulk ingestion preparation', {
    bulkDir,
    indexes: indexes.length > 0 ? indexes : 'all',
  });

  const allFiles = await deps.readAllBulkFiles(bulkDir);
  const filteredFiles = filterBySubject(allFiles, subjectFilter);
  logFilesLoaded(allFiles.length, filteredFiles.length, subjectFilter);

  const { files: ingestFiles, restrictedLessonsExcluded } = excludeRestrictedForIngest(
    filteredFiles,
    includeRestricted,
  );

  const bulkDownloadFiles = ingestFiles.map((f) => f.data);
  const sequenceSlugs = bulkDownloadFiles.map((f) => f.sequenceSlug);
  const categoryMap = await fetchCategories(deps, client, sequenceSlugs);

  const phases = await deps.collectPhaseResults(
    ingestFiles,
    bulkDownloadFiles,
    client,
    indexes,
    resolveIndex,
    categoryMap,
  );

  const stats = buildIngestionStats(
    ingestFiles.length,
    phases.processingResult,
    phases.threadCount,
    phases.sequenceResult,
    phases.vocabStats,
    restrictedLessonsExcluded,
  );

  ingestLogger.info('Bulk ingestion preparation complete', {
    ...stats,
    totalOperations: phases.operations.length,
  });
  return { operations: phases.operations, stats };
}
