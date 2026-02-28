/**
 * Vocabulary mining adapter for extracting vocabulary data from bulk downloads.
 *
 * @remarks
 * Integrates the SDK's vocabulary extractors and generators into the
 * ingestion pipeline. Extracts keywords, misconceptions, learning points,
 * and other vocabulary data, plus mines synonyms from keyword definitions.

 */
import {
  type BulkDownloadFile,
  processBulkData,
  type BulkDataInput,
  type ProcessingResult,
  type ExtractedData,
  type ExtractionStats,
  generateMinedSynonyms,
  type MinedSynonymsData,
} from '@oaknational/sdk-codegen/bulk';

/**
 * Statistics from vocabulary mining.
 */
export interface VocabularyMiningStats {
  readonly filesProcessed: number;
  readonly totalLessons: number;
  readonly totalUnits: number;
  readonly uniqueKeywords: number;
  readonly totalMisconceptions: number;
  readonly totalLearningPoints: number;
  readonly totalTeacherTips: number;
  readonly totalPriorKnowledge: number;
  readonly totalNCStatements: number;
  readonly uniqueThreads: number;
  readonly synonymsExtracted: number;
}

/** Returns a zero-value VocabularyMiningStats (all counts zero). */
export function emptyVocabularyStats(): VocabularyMiningStats {
  return {
    filesProcessed: 0,
    totalLessons: 0,
    totalUnits: 0,
    uniqueKeywords: 0,
    totalMisconceptions: 0,
    totalLearningPoints: 0,
    totalTeacherTips: 0,
    totalPriorKnowledge: 0,
    totalNCStatements: 0,
    uniqueThreads: 0,
    synonymsExtracted: 0,
  };
}

/**
 * Complete result from vocabulary mining.
 */
export interface VocabularyMiningResult {
  readonly stats: ExtractionStats;
  readonly extractedData: ExtractedData;
}

/**
 * Vocabulary mining adapter interface.
 *
 * @remarks
 * Provides access to extracted vocabulary data and mined synonyms.
 * Use this to get vocabulary analytics during ingestion.
 */
export interface VocabularyMiningAdapter {
  /** Get the full vocabulary extraction result */
  readonly getVocabularyResult: () => VocabularyMiningResult;

  /** Get mined synonyms from keyword definitions */
  readonly getMinedSynonyms: () => MinedSynonymsData;

  /** Get comprehensive statistics */
  readonly getStats: () => VocabularyMiningStats;
}

/**
 * Converts a BulkDownloadFile to BulkDataInput format.
 *
 * @param bulkFile - The bulk download file
 * @returns BulkDataInput for processing
 */
function toBulkDataInput(bulkFile: BulkDownloadFile): BulkDataInput {
  return {
    sequenceSlug: bulkFile.sequenceSlug,
    lessons: bulkFile.lessons,
    units: bulkFile.sequence,
  };
}

/**
 * Creates a VocabularyMiningAdapter from bulk download files.
 *
 * @remarks
 * Runs vocabulary extraction on all provided bulk files and prepares
 * the extracted data for use in the ingestion pipeline. Also mines
 * synonyms from keyword definitions using pattern matching.
 *
 * @param bulkFiles - Array of parsed bulk download files
 * @returns VocabularyMiningAdapter with extracted vocabulary data
 *
 * @example
 * ```typescript
 * import { readAllBulkFiles } from '@oaknational/sdk-codegen/bulk';
 * import { createVocabularyMiningAdapter } from './vocabulary-mining-adapter';
 *
 * const bulkFiles = await readAllBulkFiles('./bulk-downloads');
 * const adapter = createVocabularyMiningAdapter(bulkFiles);
 *
 * const stats = adapter.getStats();
 * console.log(`Extracted ${stats.uniqueKeywords} unique keywords`);
 *
 * const synonyms = adapter.getMinedSynonyms();
 * console.log(`Mined ${synonyms.stats.synonymsExtracted} synonyms`);
 * ```
 */
export function createVocabularyMiningAdapter(
  bulkFiles: readonly BulkDownloadFile[],
): VocabularyMiningAdapter {
  // Convert bulk files to processing input format
  const inputs = bulkFiles.map(toBulkDataInput);

  // Run vocabulary extraction
  const processingResult: ProcessingResult = processBulkData(inputs);

  // Mine synonyms from extracted keywords
  const minedSynonyms = generateMinedSynonyms(processingResult.extractedData.keywords);

  // Build comprehensive stats
  const stats: VocabularyMiningStats = {
    filesProcessed: processingResult.filesProcessed,
    totalLessons: processingResult.totalLessons,
    totalUnits: processingResult.totalUnits,
    uniqueKeywords: processingResult.stats.uniqueKeywords,
    totalMisconceptions: processingResult.stats.totalMisconceptions,
    totalLearningPoints: processingResult.stats.totalLearningPoints,
    totalTeacherTips: processingResult.stats.totalTeacherTips,
    totalPriorKnowledge: processingResult.stats.totalPriorKnowledge,
    totalNCStatements: processingResult.stats.totalNCStatements,
    uniqueThreads: processingResult.stats.uniqueThreads,
    synonymsExtracted: minedSynonyms.stats.synonymsExtracted,
  };

  return {
    getVocabularyResult: () => ({
      stats: processingResult.stats,
      extractedData: processingResult.extractedData,
    }),

    getMinedSynonyms: () => minedSynonyms,

    getStats: () => stats,
  };
}
