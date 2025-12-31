/**
 * Template strings for bulk schema generation (part 2).
 *
 * @remarks
 * Contains additional Zod schema code templates.
 * Separated for maintainability and to stay under max-lines lint rule.
 *
 * @module type-gen/typegen/bulk/schema-templates-part2
 */

import { BULK_LESSON_DELTA, BULK_UNIT_DELTA } from './schema-templates.js';

/** Lesson schema template */
export const LESSON_TEMPLATE = `
// ============================================================================
// Lesson Schema (extends API with bulk-specific fields)
// ============================================================================

/**
 * Schema for lesson records in bulk download.
 *
 * @remarks
 * Extends API LessonSummaryResponseSchema with:
 * - lessonSlug: identifier (not in API summary response)
 * - transcript_sentences: plain text transcript
 * - transcript_vtt: WebVTT captions
 *
 * Handles bulk-specific NULL sentinel transformation.
 */
export const lessonSchema = z
  .object({
    // Identifier (bulk-only - not in API summary)
    lessonSlug: z.string(),

    // Core fields (identical to API)
    lessonTitle: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),

    // Vocabulary fields (identical to API)
    lessonKeywords: z.array(lessonKeywordSchema),
    keyLearningPoints: z.array(keyLearningPointSchema),
    misconceptionsAndCommonMistakes: z.array(misconceptionSchema),
    pupilLessonOutcome: z.string(),
    teacherTips: z.array(teacherTipSchema),

    // Fields with NULL sentinel handling
    contentGuidance: contentGuidanceSchema,
    supervisionLevel: nullSentinelSchema,

    // Bulk-specific casing (lowercase 'a')
    downloadsavailable: z.boolean(),

    // Bulk-only transcript fields (NULL sentinel handling)
    transcript_sentences: nullSentinelSchema.optional(),
    transcript_vtt: nullSentinelSchema.optional(),
  })
  .strict();

/** Parsed lesson type */
export type Lesson = z.infer<typeof lessonSchema>;
`;

/**
 * Schema for KS4 exam board options at the file level.
 * Present only in secondary bulk files that have KS4 content.
 */
export const KS4_OPTION_SCHEMA_TEMPLATE = `
/**
 * Schema for KS4 exam board options at the file level.
 * Lists available exam boards for this subject sequence.
 */
export const ks4OptionSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
  })
  .strict();

/** KS4 option type */
export type Ks4Option = z.infer<typeof ks4OptionSchema>;
`;

/** Bulk file schema template */
export const BULK_FILE_TEMPLATE = `
// ============================================================================
// Bulk Download File Schema
// ============================================================================

${KS4_OPTION_SCHEMA_TEMPLATE}

/**
 * Schema for complete bulk download JSON file.
 *
 * @remarks
 * Each bulk file contains one sequence (subject-phase combination):
 * - sequenceSlug: e.g., "maths-primary", "science-secondary"
 * - subjectTitle: human-readable subject name
 * - ks4Options: available exam boards (secondary files only)
 * - sequence: array of units in teaching order
 * - lessons: flat array of all lessons
 */
export const bulkDownloadFileSchema = z
  .object({
    sequenceSlug: z.string(),
    subjectTitle: z.string(),
    ks4Options: z.array(ks4OptionSchema).optional(),
    sequence: z.array(unitSchema),
    lessons: z.array(lessonSchema),
  })
  .strict();

/** Parsed bulk download file type */
export type BulkDownloadFile = z.infer<typeof bulkDownloadFileSchema>;
`;

/**
 * Generate delta documentation template with actual values.
 */
export function getDeltaDocumentationTemplate(): string {
  return `
// ============================================================================
// Schema Delta Documentation
// ============================================================================

/**
 * Documents the differences between bulk download and API schemas.
 *
 * @remarks
 * This constant is for documentation only - not used at runtime.
 * It captures the schema delta that justifies generating bulk-specific schemas.
 */
export const BULK_SCHEMA_DELTA = {
  lesson: ${JSON.stringify(BULK_LESSON_DELTA, null, 4)},
  unit: ${JSON.stringify(BULK_UNIT_DELTA, null, 4)},
} as const;
`;
}

/** Index file template */
export const INDEX_TEMPLATE = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Public exports for bulk download schemas.
 *
 * @module types/generated/bulk
 */

export {
  // NULL sentinel handling
  nullSentinelSchema,
  type NullSentinel,

  // Vocabulary schemas (match API)
  lessonKeywordSchema,
  type LessonKeyword,
  keyLearningPointSchema,
  type KeyLearningPoint,
  misconceptionSchema,
  type Misconception,
  teacherTipSchema,
  type TeacherTip,

  // Content guidance
  contentGuidanceItemSchema,
  type ContentGuidanceItem,
  contentGuidanceSchema,
  type ContentGuidance,

  // Unit schemas
  unitThreadSchema,
  type UnitThread,
  unitLessonSchema,
  type UnitLesson,
  examBoardSchema,
  type ExamBoard,
  unitSchema,
  type Unit,

  // KS4 options
  ks4OptionSchema,
  type Ks4Option,

  // Lesson schema
  lessonSchema,
  type Lesson,

  // Bulk file schema
  bulkDownloadFileSchema,
  type BulkDownloadFile,

  // Documentation
  BULK_SCHEMA_DELTA,
} from './bulk-schemas.js';
`;
