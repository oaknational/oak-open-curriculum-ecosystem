/**
 * Bulk download parsing and processing for Oak curriculum data.
 *
 * @remarks
 * This module provides Zod schemas, utilities, extractors, and generators
 * for processing Oak's bulk download files. Each file represents one
 * subject-phase combination (e.g., maths-primary, science-secondary).
 *
 * The bulk data processing pipeline consists of:
 * - **Schemas**: Zod schemas for validating bulk download JSON
 * - **Reader**: File reading and parsing utilities
 * - **Extractors**: Extract vocabulary data from lessons and units
 * - **Generators**: Transform extracted data into various output formats
 * - **Processing**: Core orchestration logic
 *
 * @example
 * ```ts
 * import {
 *   parseBulkFile,
 *   readAllBulkFiles,
 *   processBulkData,
 *   type BulkDownloadFile,
 * } from '@oaknational/oak-curriculum-sdk/public/bulk';
 *
 * // Parse and process bulk files
 * const allFiles = await readAllBulkFiles('bulk-downloads/');
 * const input = allFiles.map(f => ({
 *   sequenceSlug: f.data.sequenceSlug,
 *   lessons: f.data.lessons,
 *   units: f.data.sequence,
 * }));
 * const result = processBulkData(input);
 * console.log(`Extracted ${result.stats.uniqueKeywords} keywords`);
 * ```

 */

// ============================================================================
// Schemas
// ============================================================================

export {
  // Vocabulary schemas
  keyLearningPointSchema,
  lessonKeywordSchema,
  misconceptionSchema,
  nullSentinelSchema,
  teacherTipSchema,
  // Content guidance
  contentGuidanceItemSchema,
  contentGuidanceSchema,
  // Unit schemas
  unitLessonSchema,
  unitSchema,
  unitThreadSchema,
  // Lesson schema
  lessonSchema,
  // Bulk file schema
  bulkDownloadFileSchema,
  // Schema delta documentation
  BULK_SCHEMA_DELTA,
} from '../types/generated/bulk/index.js';

// ============================================================================
// Schema Types
// ============================================================================

export type {
  // Vocabulary types
  KeyLearningPoint,
  LessonKeyword,
  Misconception,
  TeacherTip,
  // Content guidance types
  ContentGuidance,
  ContentGuidanceItem,
  // Unit types
  Unit,
  UnitLesson,
  UnitThread,
  // Lesson type
  Lesson,
  // Bulk file type
  BulkDownloadFile,
  // NULL sentinel type
  NullSentinel,
} from '../types/generated/bulk/index.js';

// ============================================================================
// Reader utilities
// ============================================================================

export {
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
} from './reader.js';

export type { BulkFileResult, SubjectPhase } from './reader.js';

// ============================================================================
// Extractors
// ============================================================================

export {
  extractKeywords,
  normaliseKeyword,
  extractMisconceptions,
  extractPriorKnowledge,
  extractNCStatements,
  extractThreads,
  extractLearningPoints,
  extractTeacherTips,
} from './extractors/index.js';

export type {
  ExtractedKeyword,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
  ExtractedNCStatement,
  ExtractedThread,
  ThreadUnit,
  ExtractedLearningPoint,
  ExtractedTeacherTip,
} from './extractors/index.js';

// ============================================================================
// Processing
// ============================================================================

export { processBulkData } from './processing.js';

export type {
  BulkDataInput,
  ExtractionStats,
  ExtractedData,
  ProcessingResult,
} from './processing.js';

// ============================================================================
// Generators
// ============================================================================

export {
  generateAnalysisReport,
  serializeAnalysisReport,
  writeAnalysisReportFile,
  generateMisconceptionGraphData,
  serializeMisconceptionGraph,
  writeMisconceptionGraphFile,
  generateNCCoverageGraphData,
  serializeNCCoverageGraph,
  writeNCCoverageGraphFile,
  extractSynonymFromDefinition,
  generateMinedSynonyms,
  serializeMinedSynonyms,
  writeMinedSynonymsFile,
  generatePrerequisiteGraphData,
  generateThreadProgressionData,
  generateVocabularyGraphData,
  serializeVocabularyGraph,
  writeVocabularyGraphFile,
  serializePrerequisiteGraph,
  serializeThreadProgressionGraph,
  writePrerequisiteGraphFile,
  writeThreadProgressionFile,
} from './generators/index.js';

export type {
  AnalysisReport,
  AnalysisSummary,
  CrossSubjectTermEntry,
  KeywordFrequencyEntry,
  KeywordStats,
  MisconceptionDensity,
  NCCoverage,
  SubjectRankEntry,
  SynonymCandidate,
  SynonymPatterns,
  MisconceptionGraph,
  MisconceptionGraphStats,
  MisconceptionNode,
  NCCoverageGraph,
  NCCoverageGraphStats,
  NCStatementNode,
  MinedSynonym,
  MinedSynonymsData,
  MinedSynonymsStats,
  PrerequisiteEdge,
  PrerequisiteGraph,
  PrerequisiteGraphStats,
  PrerequisiteNode,
  ThreadNode,
  ThreadProgressionGraph,
  ThreadProgressionStats,
  VocabularyGraph,
  VocabularyGraphStats,
  VocabularyNode,
} from './generators/index.js';
