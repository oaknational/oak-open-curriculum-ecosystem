/**
 * Subpath barrel: `@oaknational/curriculum-sdk-generation/bulk`
 *
 * Bulk download data schemas, types, and validation infrastructure.
 */

export {
  nullSentinelSchema,
  lessonKeywordSchema,
  keyLearningPointSchema,
  misconceptionSchema,
  teacherTipSchema,
  contentGuidanceItemSchema,
  contentGuidanceSchema,
  unitThreadSchema,
  unitLessonSchema,
  examBoardSchema,
  unitSchema,
  ks4OptionSchema,
  lessonSchema,
  bulkDownloadFileSchema,
  BULK_SCHEMA_DELTA,
} from './types/generated/bulk/index.js';
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
} from './types/generated/bulk/index.js';
