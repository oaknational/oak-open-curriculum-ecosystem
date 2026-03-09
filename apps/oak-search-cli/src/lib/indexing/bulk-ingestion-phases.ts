/**
 * Processing phases for bulk ingestion.
 *
 * @remarks
 * Each phase transforms bulk download files into Elasticsearch bulk operations for a
 * specific index kind (curriculum, threads, sequences). The {@link collectPhaseResults}
 * function conditionally executes only the phases required by the requested index filter.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */
import type { BulkDownloadFile, BulkFileResult } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from '../../adapters/oak-adapter';
import { createHybridDataSource } from '../../adapters/hybrid-data-source';
import {
  createVocabularyMiningAdapter,
  type VocabularyMiningStats,
  emptyVocabularyStats,
} from '../../adapters/vocabulary-mining-adapter';
import {
  extractThreadsFromBulkFiles,
  buildThreadBulkOperations,
} from '../../adapters/bulk-thread-transformer';
import { buildSequenceBulkOperations } from '../../adapters/bulk-sequence-transformer';
import type { BulkOperationEntry } from './bulk-operation-types';
import type { SearchIndexKind } from '../search-index-target';
import { ingestLogger } from '../logger';

const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';
const THREADS_INDEX = 'oak_threads';
const SEQUENCES_INDEX = 'oak_sequences';
const SEQUENCE_FACETS_INDEX = 'oak_sequence_facets';
const CURRICULUM_INDEX_KINDS: readonly SearchIndexKind[] = ['lessons', 'units', 'unit_rollup'];
const SEQUENCE_INDEX_KINDS: readonly SearchIndexKind[] = ['sequences', 'sequence_facets'];

/** Check whether any of the requested indexes overlap with the given set. */
function needsIndexKinds(
  requested: readonly SearchIndexKind[],
  target: readonly SearchIndexKind[],
): boolean {
  return requested.length === 0 || requested.some((idx) => target.includes(idx));
}

/** Check whether threads index is needed. */
function needsThreads(requested: readonly SearchIndexKind[]): boolean {
  return requested.length === 0 || requested.includes('threads');
}

/** Intermediate result from processing curriculum bulk files. */
export interface BulkProcessingAccumulator {
  readonly operations: BulkOperationEntry[];
  readonly totalLessons: number;
  readonly totalUnits: number;
  readonly totalRollups: number;
}

/** Thread extraction result with operations and count. */
interface ThreadExtractionResult {
  readonly operations: BulkOperationEntry[];
  readonly count: number;
}

/** Sequence extraction result with operations and counts. */
interface SequenceExtractionResult {
  readonly operations: BulkOperationEntry[];
  readonly sequenceCount: number;
  readonly facetCount: number;
}

/** Processes a single bulk file through HybridDataSource. */
async function processSingleBulkFile(
  fileResult: BulkFileResult,
  client: OakClient,
): Promise<BulkProcessingAccumulator> {
  const sourceResult = await createHybridDataSource(fileResult.data, client);
  if (!sourceResult.ok) {
    ingestLogger.error('Data source creation failed', {
      sequence: fileResult.data.sequenceSlug,
      error: sourceResult.error.message,
      errorType: sourceResult.error.type,
    });
    throw new Error(sourceResult.error.message);
  }
  const hybridSource = sourceResult.value;
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

/** Extracts vocabulary statistics from bulk files. */
function extractVocabularyStats(files: readonly BulkDownloadFile[]): VocabularyMiningStats {
  return createVocabularyMiningAdapter(files).getStats();
}

/** Builds final ingestion stats from phase results. */
export function buildIngestionStats(
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

/** Stats shape used by {@link buildIngestionStats}. Re-exported for consumer convenience. */
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

/** Collected results from all ingestion phases. */
export interface PhaseResults {
  readonly operations: BulkOperationEntry[];
  readonly processingResult: BulkProcessingAccumulator;
  readonly threadCount: number;
  readonly sequenceResult: SequenceExtractionResult;
  readonly vocabStats: VocabularyMiningStats;
}

/**
 * Conditionally execute ingestion phases based on the requested index filter.
 *
 * @remarks
 * Applies the "skip early" pattern: each phase is only executed when the requested indexes
 * overlap with that phase's output kinds. When no indexes are specified, all phases run.
 */
export async function collectPhaseResults(
  filteredFiles: readonly BulkFileResult[],
  bulkDownloadFiles: readonly BulkDownloadFile[],
  client: OakClient,
  indexes: readonly SearchIndexKind[],
): Promise<PhaseResults> {
  const doCurriculum = needsIndexKinds(indexes, CURRICULUM_INDEX_KINDS);
  const doThreads = needsThreads(indexes);
  const doSequences = needsIndexKinds(indexes, SEQUENCE_INDEX_KINDS);

  ingestLogger.debug('Index filter applied', {
    curriculum: doCurriculum,
    threads: doThreads,
    sequences: doSequences,
  });

  const processingResult: BulkProcessingAccumulator = doCurriculum
    ? await processAllBulkFiles(filteredFiles, client)
    : { operations: [], totalLessons: 0, totalUnits: 0, totalRollups: 0 };

  const threadResult: ThreadExtractionResult = doThreads
    ? extractAndBuildThreadOperations(bulkDownloadFiles)
    : { operations: [], count: 0 };

  const sequenceResult: SequenceExtractionResult = doSequences
    ? extractAndBuildSequenceOperations(bulkDownloadFiles)
    : { operations: [], sequenceCount: 0, facetCount: 0 };

  const operations = [
    ...processingResult.operations,
    ...threadResult.operations,
    ...sequenceResult.operations,
  ];

  const vocabStats = doCurriculum
    ? extractVocabularyStats(bulkDownloadFiles)
    : emptyVocabularyStats();

  return {
    operations,
    processingResult,
    threadCount: threadResult.count,
    sequenceResult,
    vocabStats,
  };
}
