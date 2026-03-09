/**
 * Statistics types and builders for bulk ingestion.
 *
 * @remarks
 * Extracted from `bulk-ingestion-phases.ts` to keep modules within the
 * max-lines limit. These types flow through the ingestion pipeline and
 * are consumed by the CLI admin commands and the versioned ingest closure.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */
import type { VocabularyMiningStats } from '../../adapters/vocabulary-mining-adapter';
import type { BulkProcessingAccumulator, SequenceExtractionResult } from './bulk-ingestion-phases';

/** Stats shape for a completed bulk ingestion run. */
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
