/**
 * Public bulk download API for Oak curriculum data.
 *
 * @remarks
 * Re-exports bulk parsing schemas, extractors, generators, and processing
 * utilities for use by consuming applications.
 * Import from `@oaknational/curriculum-sdk/public/bulk`.
 *
 * @example
 * ```ts
 * import {
 *   parseBulkFile,
 *   readAllBulkFiles,
 *   processBulkData,
 *   extractKeywords,
 *   generateVocabularyGraphData,
 *   type BulkDownloadFile,
 *   type Lesson,
 *   type ExtractedKeyword,
 * } from '@oaknational/curriculum-sdk/public/bulk';
 *
 * // Parse and process bulk files
 * const allFiles = await readAllBulkFiles('bulk-downloads/');
 * const input = allFiles.map(f => ({
 *   sequenceSlug: f.data.sequenceSlug,
 *   lessons: f.data.lessons,
 *   units: f.data.sequence,
 * }));
 * const result = processBulkData(input);
 * console.log(`Processed ${result.totalLessons} lessons`);
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
} from '../bulk/index.js';

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
  // Reader types
  BulkFileResult,
  SubjectPhase,
} from '../bulk/index.js';

// ============================================================================
// Reader utilities
// ============================================================================

export {
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
} from '../bulk/index.js';

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
} from '../bulk/index.js';

export type {
  ExtractedKeyword,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
  ExtractedNCStatement,
  ExtractedThread,
  ThreadUnit,
  ExtractedLearningPoint,
  ExtractedTeacherTip,
} from '../bulk/index.js';

// ============================================================================
// Processing
// ============================================================================

export { processBulkData } from '../bulk/index.js';

export type {
  BulkDataInput,
  ExtractionStats,
  ExtractedData,
  ProcessingResult,
} from '../bulk/index.js';

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
} from '../bulk/index.js';

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
} from '../bulk/index.js';
