/**
 * Bulk-first ingestion module for Elasticsearch.
 *
 * @remarks
 * Uses HybridDataSource to create bulk operations from bulk download files,
 * with API supplementation for KS4 tier enrichment.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @module lib/indexing/bulk-ingestion
 */
import {
  readAllBulkFiles,
  type BulkDownloadFile,
  type BulkFileResult,
} from '@oaknational/oak-curriculum-sdk/public/bulk';
import { type OakClient } from '../../adapters/oak-adapter';
import { createHybridDataSource } from '../../adapters/hybrid-data-source';
import {
  createVocabularyMiningAdapter,
  type VocabularyMiningStats,
} from '../../adapters/vocabulary-mining-adapter';
import {
  extractThreadsFromBulkFiles,
  buildThreadBulkOperations,
} from '../../adapters/bulk-thread-transformer';
import type { BulkOperations, BulkOperationEntry } from './bulk-operation-types';
import { ingestLogger } from '../logger';

/**
 * Statistics from bulk ingestion.
 */
export interface BulkIngestionStats {
  readonly filesProcessed: number;
  readonly lessonsIndexed: number;
  readonly unitsIndexed: number;
  readonly rollupsIndexed: number;
  readonly threadsIndexed: number;
  readonly vocabularyStats: {
    readonly uniqueKeywords: number;
    readonly totalMisconceptions: number;
    readonly synonymsExtracted: number;
  };
}

/**
 * Result from bulk ingestion preparation.
 */
export interface BulkIngestionResult {
  readonly operations: BulkOperations;
  readonly stats: BulkIngestionStats;
}

/**
 * Options for bulk ingestion.
 */
export interface BulkIngestionOptions {
  /** Path to bulk download directory */
  readonly bulkDir: string;
  /** Oak client for API supplementation */
  readonly client: OakClient;
  /** Optional filter for specific subjects */
  readonly subjectFilter?: readonly string[];
}

/**
 * Intermediate result from processing bulk files.
 */
interface BulkProcessingAccumulator {
  readonly operations: BulkOperationEntry[];
  readonly totalLessons: number;
  readonly totalUnits: number;
  readonly totalRollups: number;
}

/**
 * Filters bulk file results by subject if filter is provided.
 */
function filterBySubject(
  files: readonly BulkFileResult[],
  subjectFilter?: readonly string[],
): readonly BulkFileResult[] {
  if (!subjectFilter || subjectFilter.length === 0) {
    return files;
  }

  const filterSet = new Set(subjectFilter);
  return files.filter((file) => {
    // Extract subject from sequenceSlug (e.g., "maths-primary" -> "maths")
    const subject = file.data.sequenceSlug.split('-')[0];
    return subject !== undefined && filterSet.has(subject);
  });
}

/** Index names for bulk operations */
const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';
const THREADS_INDEX = 'oak_threads';

/**
 * Processes a single bulk file through HybridDataSource.
 */
async function processSingleBulkFile(
  fileResult: BulkFileResult,
  client: OakClient,
): Promise<BulkProcessingAccumulator> {
  ingestLogger.debug('Processing bulk file', {
    sequenceSlug: fileResult.data.sequenceSlug,
    lessonCount: fileResult.data.lessons.length,
    unitCount: fileResult.data.sequence.length,
  });

  const hybridSource = await createHybridDataSource(fileResult.data, client);
  const fileOperations = hybridSource.toBulkOperations(
    LESSONS_INDEX,
    UNITS_INDEX,
    UNIT_ROLLUP_INDEX,
  );
  const stats = hybridSource.getStats();

  ingestLogger.debug('Processed bulk file', {
    sequenceSlug: fileResult.data.sequenceSlug,
    operations: fileOperations.length,
    rollups: stats.rollupCount,
  });

  return {
    operations: [...fileOperations],
    totalLessons: stats.lessonCount,
    totalUnits: stats.unitCount,
    totalRollups: stats.rollupCount,
  };
}

/**
 * Processes all bulk files and accumulates results.
 */
async function processAllBulkFiles(
  files: readonly BulkFileResult[],
  client: OakClient,
): Promise<BulkProcessingAccumulator> {
  const allOperations: BulkOperationEntry[] = [];
  let totalLessons = 0;
  let totalUnits = 0;
  let totalRollups = 0;

  for (const fileResult of files) {
    const result = await processSingleBulkFile(fileResult, client);
    allOperations.push(...result.operations);
    totalLessons += result.totalLessons;
    totalUnits += result.totalUnits;
    totalRollups += result.totalRollups;
  }

  return { operations: allOperations, totalLessons, totalUnits, totalRollups };
}

/**
 * Extracts vocabulary statistics from bulk files.
 */
function extractVocabularyStats(files: readonly BulkDownloadFile[]): VocabularyMiningStats {
  const vocabAdapter = createVocabularyMiningAdapter(files);
  return vocabAdapter.getStats();
}

/**
 * Builds final ingestion stats from processing results.
 */
function buildIngestionStats(
  filesProcessed: number,
  processingResult: BulkProcessingAccumulator,
  threadsCount: number,
  vocabStats: VocabularyMiningStats,
): BulkIngestionStats {
  return {
    filesProcessed,
    lessonsIndexed: processingResult.totalLessons,
    unitsIndexed: processingResult.totalUnits,
    rollupsIndexed: processingResult.totalRollups,
    threadsIndexed: threadsCount,
    vocabularyStats: {
      uniqueKeywords: vocabStats.uniqueKeywords,
      totalMisconceptions: vocabStats.totalMisconceptions,
      synonymsExtracted: vocabStats.synonymsExtracted,
    },
  };
}

/** Thread extraction result with operations and count. */
interface ThreadExtractionResult {
  readonly operations: BulkOperationEntry[];
  readonly count: number;
}

/** Extracts threads from bulk files and builds bulk operations. */
function extractAndBuildThreadOperations(
  files: readonly BulkDownloadFile[],
): ThreadExtractionResult {
  const threads = extractThreadsFromBulkFiles(files);
  const operations = buildThreadBulkOperations(threads, THREADS_INDEX);
  ingestLogger.debug('Threads extracted', {
    uniqueThreads: threads.length,
    threadOperations: operations.length,
  });
  return { operations, count: threads.length };
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
  const { bulkDir, client, subjectFilter } = options;
  ingestLogger.info('Starting bulk ingestion preparation', { bulkDir });

  const allFiles = await readAllBulkFiles(bulkDir);
  const filteredFiles = filterBySubject(allFiles, subjectFilter);
  logFilesLoaded(allFiles.length, filteredFiles.length, subjectFilter);

  const processingResult = await processAllBulkFiles(filteredFiles, client);
  const bulkDownloadFiles = filteredFiles.map((f) => f.data);
  const threadResult = extractAndBuildThreadOperations(bulkDownloadFiles);
  const allOperations = [...processingResult.operations, ...threadResult.operations];
  const vocabStats = extractVocabularyStats(bulkDownloadFiles);
  const stats = buildIngestionStats(
    filteredFiles.length,
    processingResult,
    threadResult.count,
    vocabStats,
  );

  ingestLogger.info('Bulk ingestion preparation complete', {
    ...stats,
    totalOperations: allOperations.length,
  });
  return { operations: allOperations, stats };
}
