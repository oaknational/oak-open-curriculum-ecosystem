/**
 * Core library modules for the vocabulary mining pipeline.
 *
 * @module vocab-gen/lib
 */

// Vocabulary schemas (keywords, learning points, misconceptions, tips)
export {
  keyLearningPointSchema,
  lessonKeywordSchema,
  misconceptionSchema,
  nullSentinelSchema,
  teacherTipSchema,
} from './vocabulary-schemas.js';
export type {
  KeyLearningPoint,
  LessonKeyword,
  Misconception,
  TeacherTip,
} from './vocabulary-schemas.js';

// Content guidance schema
export { contentGuidanceItemSchema, contentGuidanceSchema } from './content-guidance-schema.js';
export type { ContentGuidance, ContentGuidanceItem } from './content-guidance-schema.js';

// Unit schemas (threads, lessons, units)
export { unitLessonSchema, unitSchema, unitThreadSchema } from './unit-schemas.js';
export type { Unit, UnitLesson, UnitThread } from './unit-schemas.js';

// Lesson schema
export { lessonSchema } from './lesson-schema.js';
export type { Lesson } from './lesson-schema.js';

// Bulk download file schema
export { bulkDownloadFileSchema } from './bulk-file-schema.js';
export type { BulkDownloadFile } from './bulk-file-schema.js';

// Bulk reader utilities
export {
  discoverBulkFiles,
  extractSubjectPhase,
  parseBulkFile,
  readAllBulkFiles,
} from './bulk-reader.js';
export type { SubjectPhase } from './bulk-reader.js';
