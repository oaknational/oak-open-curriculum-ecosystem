/**
 * Core library modules for the vocabulary mining pipeline.
 *
 * @remarks
 * Re-exports bulk parsing schemas and utilities from the SDK generated bulk module.
 * This ensures a single source of truth for bulk data types while
 * maintaining backwards compatibility with vocab-gen imports.

 */

// ============================================================================
// Re-export from SDK generated bulk module (single source of truth)
// ============================================================================

// Vocabulary schemas (keywords, learning points, misconceptions, tips)
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
  lessonSchema,
  bulkDownloadFileSchema,
} from '../../src/bulk/index.js';
export type {
  KeyLearningPoint,
  LessonKeyword,
  Misconception,
  TeacherTip,
  ContentGuidance,
  ContentGuidanceItem,
  Unit,
  UnitLesson,
  UnitThread,
  Lesson,
  BulkDownloadFile,
} from '../../src/bulk/index.js';

// Bulk reader utilities
export {
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
} from '../../src/bulk/reader.js';
export type { SubjectPhase } from '../../src/bulk/reader.js';
