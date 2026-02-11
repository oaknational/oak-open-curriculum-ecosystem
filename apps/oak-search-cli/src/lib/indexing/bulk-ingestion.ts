/**
 * Bulk-first ingestion module for Elasticsearch.
 * @see ADR-093 Bulk-First Ingestion Strategy
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
import { buildSequenceBulkOperations } from '../../adapters/bulk-sequence-transformer';
import type { BulkOperations, BulkOperationEntry } from './bulk-operation-types';
import { ingestLogger } from '../logger';

/** Statistics from bulk ingestion. */
export interface BulkIngestionStats {
  readonly filesProcessed: number;
  readonly lessonsIndexed: number;
  readonly unitsIndexed: number;
  readonly rollupsIndexed: number;
  readonly threadsIndexed: number;
  readonly sequencesIndexed: number;
  readonly sequenceFacetsIndexed: number;
  readonly vocabularyStats: {
    readonly uniqueKeywords: number;
    readonly totalMisconceptions: number;
    readonly synonymsExtracted: number;
  };
}

/** Result from bulk ingestion preparation. */
export interface BulkIngestionResult {
  readonly operations: BulkOperations;
  readonly stats: BulkIngestionStats;
}

/** Options for bulk ingestion. */
export interface BulkIngestionOptions {
  readonly bulkDir: string;
  readonly client: OakClient;
  readonly subjectFilter?: readonly string[];
}

/** Intermediate result from processing bulk files. */
interface BulkProcessingAccumulator {
  readonly operations: BulkOperationEntry[];
  readonly totalLessons: number;
  readonly totalUnits: number;
  readonly totalRollups: number;
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

/** Index names for bulk operations */
const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';
const THREADS_INDEX = 'oak_threads';
const SEQUENCES_INDEX = 'oak_sequences';
const SEQUENCE_FACETS_INDEX = 'oak_sequence_facets';

/** Processes a single bulk file through HybridDataSource. */
async function processSingleBulkFile(
  fileResult: BulkFileResult,
  client: OakClient,
): Promise<BulkProcessingAccumulator> {
  const hybridSource = await createHybridDataSource(fileResult.data, client);
  const fileOperations = hybridSource.toBulkOperations(
    LESSONS_INDEX,
    UNITS_INDEX,
    UNIT_ROLLUP_INDEX,
  );
  const stats = hybridSource.getStats();
  return {
    operations: [...fileOperations],
    totalLessons: stats.lessonCount,
    totalUnits: stats.unitCount,
    totalRollups: stats.rollupCount,
  };
}

/** Processes all bulk files and accumulates results. */
async function processAllBulkFiles(
  files: readonly BulkFileResult[],
  client: OakClient,
): Promise<BulkProcessingAccumulator> {
  const allOperations: BulkOperationEntry[] = [];
  let totalLessons = 0,
    totalUnits = 0,
    totalRollups = 0;
  for (const fileResult of files) {
    const result = await processSingleBulkFile(fileResult, client);
    allOperations.push(...result.operations);
    totalLessons += result.totalLessons;
    totalUnits += result.totalUnits;
    totalRollups += result.totalRollups;
  }
  return { operations: allOperations, totalLessons, totalUnits, totalRollups };
}

/** Extracts vocabulary statistics from bulk files. */
function extractVocabularyStats(files: readonly BulkDownloadFile[]): VocabularyMiningStats {
  return createVocabularyMiningAdapter(files).getStats();
}

/** Builds final ingestion stats from processing results. */
function buildIngestionStats(
  filesProcessed: number,
  processingResult: BulkProcessingAccumulator,
  threadsCount: number,
  sequenceResult: SequenceExtractionResult,
  vocabStats: VocabularyMiningStats,
): BulkIngestionStats {
  return {
    filesProcessed,
    lessonsIndexed: processingResult.totalLessons,
    unitsIndexed: processingResult.totalUnits,
    rollupsIndexed: processingResult.totalRollups,
    threadsIndexed: threadsCount,
    sequencesIndexed: sequenceResult.sequenceCount,
    sequenceFacetsIndexed: sequenceResult.facetCount,
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

/** Sequence extraction result with operations and counts. */
interface SequenceExtractionResult {
  readonly operations: BulkOperationEntry[];
  readonly sequenceCount: number;
  readonly facetCount: number;
}

/** Extracts sequences from bulk files and builds bulk operations. */
function extractAndBuildSequenceOperations(
  files: readonly BulkDownloadFile[],
): SequenceExtractionResult {
  const operations = buildSequenceBulkOperations(files, SEQUENCES_INDEX, SEQUENCE_FACETS_INDEX);
  const sequenceCount = files.length;
  const sequenceOps = sequenceCount * 2;
  const facetCount = (operations.length - sequenceOps) / 2;
  return { operations, sequenceCount, facetCount };
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
  const sequenceResult = extractAndBuildSequenceOperations(bulkDownloadFiles);
  const allOperations = [
    ...processingResult.operations,
    ...threadResult.operations,
    ...sequenceResult.operations,
  ];
  const vocabStats = extractVocabularyStats(bulkDownloadFiles);
  const stats = buildIngestionStats(
    filteredFiles.length,
    processingResult,
    threadResult.count,
    sequenceResult,
    vocabStats,
  );

  ingestLogger.info('Bulk ingestion preparation complete', {
    ...stats,
    totalOperations: allOperations.length,
  });
  return { operations: allOperations, stats };
}
