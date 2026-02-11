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
} from '../../src/types/generated/bulk/index.js';
export type {
  KeyLearningPoint,
  LessonKeyword,
  Misconception,
  TeacherTip,
} from '../../src/types/generated/bulk/index.js';

// Content guidance schema
export {
  contentGuidanceItemSchema,
  contentGuidanceSchema,
} from '../../src/types/generated/bulk/index.js';
export type { ContentGuidance, ContentGuidanceItem } from '../../src/types/generated/bulk/index.js';

// Unit schemas (threads, lessons, units)
export {
  unitLessonSchema,
  unitSchema,
  unitThreadSchema,
} from '../../src/types/generated/bulk/index.js';
export type { Unit, UnitLesson, UnitThread } from '../../src/types/generated/bulk/index.js';

// Lesson schema
export { lessonSchema } from '../../src/types/generated/bulk/index.js';
export type { Lesson } from '../../src/types/generated/bulk/index.js';

// Bulk download file schema
export { bulkDownloadFileSchema } from '../../src/types/generated/bulk/index.js';
export type { BulkDownloadFile } from '../../src/types/generated/bulk/index.js';

// Bulk reader utilities
export {
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
} from '../../src/bulk/reader.js';
export type { SubjectPhase } from '../../src/bulk/reader.js';
