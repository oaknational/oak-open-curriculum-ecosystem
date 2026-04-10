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
import type { CategoryMap } from '../../adapters/category-supplementation';
import type { BulkOperationEntry } from './bulk-operation-types';
import {
  BASE_INDEX_NAMES,
  type IndexResolverFn,
  type SearchIndexKind,
} from '../search-index-target';
import { ingestLogger } from '../logger';

/** Default resolver returning primary (non-versioned) index names from {@link BASE_INDEX_NAMES}. */
const defaultResolveIndex: IndexResolverFn = (kind) => BASE_INDEX_NAMES[kind];

const CURRICULUM_INDEX_KINDS: readonly SearchIndexKind[] = ['lessons', 'units', 'unit_rollup'];
const SEQUENCE_INDEX_KINDS: readonly SearchIndexKind[] = ['sequences', 'sequence_facets'];

/** Check whether any of the requested indexes overlap with the given set. */
function needsIndexKinds(
  requested: readonly SearchIndexKind[],
  kinds: readonly SearchIndexKind[],
): boolean {
  return requested.length === 0 || requested.some((idx) => kinds.includes(idx));
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
export interface SequenceExtractionResult {
  readonly operations: BulkOperationEntry[];
  readonly sequenceCount: number;
  readonly facetCount: number;
}

/** Processes a single bulk file through HybridDataSource. */
async function processSingleBulkFile(
  fileResult: BulkFileResult,
  client: OakClient,
  resolveIndex: IndexResolverFn,
  categoryMap?: CategoryMap,
): Promise<BulkProcessingAccumulator> {
  const sourceResult = await createHybridDataSource(fileResult.data, client, {}, categoryMap);
  if (!sourceResult.ok) {
    ingestLogger.error('Data source creation failed', {
      sequence: fileResult.data.sequenceSlug,
      error: sourceResult.error.message,
      errorType: sourceResult.error.type,
    });
    throw new Error(sourceResult.error.message);
  }
  const hybridSource = sourceResult.value;
  const opsResult = hybridSource.toBulkOperations(
    resolveIndex('lessons'),
    resolveIndex('units'),
    resolveIndex('unit_rollup'),
  );
  if (!opsResult.ok) {
    throw new Error(opsResult.error.message);
  }
  const stats = hybridSource.getStats();
  return {
    operations: [...opsResult.value],
    totalLessons: stats.lessonCount,
    totalUnits: stats.unitCount,
    totalRollups: stats.rollupCount,
  };
}

/** Processes all bulk files and accumulates results. */
async function processAllBulkFiles(
  files: readonly BulkFileResult[],
  client: OakClient,
  resolveIndex: IndexResolverFn,
  categoryMap?: CategoryMap,
): Promise<BulkProcessingAccumulator> {
  const allOperations: BulkOperationEntry[] = [];
  let totalLessons = 0,
    totalUnits = 0,
    totalRollups = 0;
  for (const fileResult of files) {
    const result = await processSingleBulkFile(fileResult, client, resolveIndex, categoryMap);
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
  resolveIndex: IndexResolverFn,
): ThreadExtractionResult {
  const threads = extractThreadsFromBulkFiles(files);
  const operations = buildThreadBulkOperations(threads, resolveIndex('threads'));
  ingestLogger.debug('Threads extracted', {
    uniqueThreads: threads.length,
    threadOperations: operations.length,
  });
  return { operations, count: threads.length };
}

/**
 * Extracts sequences from bulk files and builds bulk operations.
 *
 * **Fail-fast contract (ADR-139)**: If any bulk file fails semantic generation
 * (e.g., invalid key stages, zero units, empty semantic output), throws
 * immediately. Entire ingest halts — no partial-success mode. Use pre-ingest
 * validation to catch issues early.
 */
function extractAndBuildSequenceOperations(
  files: readonly BulkDownloadFile[],
  resolveIndex: IndexResolverFn,
  categoryMap?: CategoryMap,
): SequenceExtractionResult {
  const operations = buildSequenceBulkOperations(
    files,
    resolveIndex('sequences'),
    resolveIndex('sequence_facets'),
    categoryMap,
  );
  const sequenceCount = files.length;
  const sequenceOps = sequenceCount * 2;
  const facetCount = (operations.length - sequenceOps) / 2;
  return { operations, sequenceCount, facetCount };
}

/** Extracts vocabulary statistics from bulk files. */
function extractVocabularyStats(files: readonly BulkDownloadFile[]): VocabularyMiningStats {
  return createVocabularyMiningAdapter(files).getStats();
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
 * Applies the "skip early" pattern: each phase runs only when the requested indexes
 * overlap with that phase's output kinds. When no indexes are specified, all phases run.
 *
 * @param resolveIndex - Optional index name resolver. Defaults to primary (non-versioned)
 *   names from {@link BASE_INDEX_NAMES}. Pass a versioned resolver (e.g. from
 *   `createVersionedIndexResolver`) to target versioned indexes for blue/green lifecycle.
 */
export async function collectPhaseResults(
  filteredFiles: readonly BulkFileResult[],
  bulkDownloadFiles: readonly BulkDownloadFile[],
  client: OakClient,
  indexes: readonly SearchIndexKind[],
  resolveIndex: IndexResolverFn = defaultResolveIndex,
  categoryMap?: CategoryMap,
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
    ? await processAllBulkFiles(filteredFiles, client, resolveIndex, categoryMap)
    : { operations: [], totalLessons: 0, totalUnits: 0, totalRollups: 0 };

  const threadResult: ThreadExtractionResult = doThreads
    ? extractAndBuildThreadOperations(bulkDownloadFiles, resolveIndex)
    : { operations: [], count: 0 };

  const sequenceResult: SequenceExtractionResult = doSequences
    ? extractAndBuildSequenceOperations(bulkDownloadFiles, resolveIndex, categoryMap)
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
