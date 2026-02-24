/**
 * Subpath barrel: `@oaknational/curriculum-sdk-generation/bulk`
 *
 * Bulk download data schemas, types, validation infrastructure,
 * reader utilities, extractors, generators, and processing.
 *
 * This is the canonical entry point for all bulk data functionality.
 * Consumers should import from this subpath rather than internal paths.
 *
 * @see `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md` — ADR-108
 */

// Re-export everything from the bulk directory module, which aggregates:
// - Generated Zod schemas and types (from types/generated/bulk/)
// - Reader utilities (discoverBulkFiles, parseBulkFile, etc.)
// - Extractors (extractKeywords, extractMisconceptions, etc.)
// - Processing (processBulkData)
// - Generators (generateVocabularyGraphData, etc.)

export {
  keyLearningPointSchema,
  lessonKeywordSchema,
  misconceptionSchema,
  nullSentinelSchema,
  teacherTipSchema,
  contentGuidanceItemSchema,
  contentGuidanceSchema,
  unitLessonSchema,
  unitSchema,
  unitThreadSchema,
  examBoardSchema,
  ks4OptionSchema,
  lessonSchema,
  bulkDownloadFileSchema,
  BULK_SCHEMA_DELTA,
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
  extractKeywords,
  normaliseKeyword,
  extractMisconceptions,
  extractPriorKnowledge,
  extractNCStatements,
  extractThreads,
  extractLearningPoints,
  extractTeacherTips,
  processBulkData,
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
} from './bulk/index.js';

export type {
  NullSentinel,
  LessonKeyword,
  KeyLearningPoint,
  Misconception,
  TeacherTip,
  ContentGuidanceItem,
  ContentGuidance,
  UnitThread,
  UnitLesson,
  ExamBoard,
  Unit,
  Ks4Option,
  Lesson,
  BulkDownloadFile,
  BulkFileResult,
  SubjectPhase,
  ExtractedKeyword,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
  ExtractedNCStatement,
  ExtractedThread,
  ThreadUnit,
  ExtractedLearningPoint,
  ExtractedTeacherTip,
  BulkDataInput,
  ExtractionStats,
  ExtractedData,
  ProcessingResult,
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
} from './bulk/index.js';

// Static graph data and ontology are in the /vocab subpath.
// Pipeline APIs, schemas, and types remain here in /bulk.
