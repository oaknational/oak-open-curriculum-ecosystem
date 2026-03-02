/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Bulk download Zod schemas for Oak curriculum data.
 * Generated at sdk-codegen time to compose with API schemas.
 *
 * @remarks
 * These schemas extend the API schemas with bulk-specific fields:
 * - Lesson: adds lessonSlug, transcripts; handles NULL sentinels
 * - Unit: adapted structure for bulk file format
 * - BulkFile: top-level file schema
 *
 * @see code-generation/typegen/bulk/generate-bulk-schemas.ts
 */

import { z } from 'zod';


// ============================================================================
// NULL Sentinel Handling
// ============================================================================

/**
 * Schema for fields that use "NULL" string sentinel in bulk data.
 *
 * @remarks
 * The bulk download uses "NULL" string literal where the API uses null.
 * This schema transforms "NULL" → null at parse time for consistency.
 * Other string values (like "Adult supervision required") pass through.
 */
export const nullSentinelSchema = z
  .union([z.string(), z.null()])
  .transform((value) => (value === 'NULL' ? null : value));

/** Type after transformation - null or string (if not "NULL" sentinel) */
export type NullSentinel = z.infer<typeof nullSentinelSchema>;


// ============================================================================
// Vocabulary Schemas (match API exactly)
// ============================================================================

/**
 * Schema for lesson keywords - identical to API.
 * @see LessonSummaryResponseSchema.lessonKeywords
 */
export const lessonKeywordSchema = z
  .object({
    keyword: z.string(),
    description: z.string(),
  })
  .strict();

/** Extracted keyword type */
export type LessonKeyword = z.infer<typeof lessonKeywordSchema>;

/**
 * Schema for key learning points - identical to API.
 * @see LessonSummaryResponseSchema.keyLearningPoints
 */
export const keyLearningPointSchema = z
  .object({
    keyLearningPoint: z.string(),
  })
  .strict();

/** Extracted learning point type */
export type KeyLearningPoint = z.infer<typeof keyLearningPointSchema>;

/**
 * Schema for misconceptions - identical to API.
 * @see LessonSummaryResponseSchema.misconceptionsAndCommonMistakes
 */
export const misconceptionSchema = z
  .object({
    misconception: z.string(),
    response: z.string(),
  })
  .strict();

/** Extracted misconception type */
export type Misconception = z.infer<typeof misconceptionSchema>;

/**
 * Schema for teacher tips - identical to API.
 * @see LessonSummaryResponseSchema.teacherTips
 */
export const teacherTipSchema = z
  .object({
    teacherTip: z.string(),
  })
  .strict();

/** Extracted teacher tip type */
export type TeacherTip = z.infer<typeof teacherTipSchema>;


// ============================================================================
// Content Guidance Schema (handles NULL sentinel)
// ============================================================================

/**
 * Schema for individual content guidance items.
 * @see LessonSummaryResponseSchema.contentGuidance array items
 */
export const contentGuidanceItemSchema = z
  .object({
    contentGuidanceArea: z.string(),
    supervisionlevel_id: z.number(),
    contentGuidanceLabel: z.string(),
    contentGuidanceDescription: z.string(),
  })
  .strict();

/** Content guidance item type */
export type ContentGuidanceItem = z.infer<typeof contentGuidanceItemSchema>;

/**
 * Schema for content guidance field with NULL sentinel handling.
 *
 * @remarks
 * Bulk data uses "NULL" string where API uses null.
 * Transforms at parse time for type consistency.
 */
export const contentGuidanceSchema = z
  .union([
    z.array(contentGuidanceItemSchema),
    z.literal('NULL'),
    z.null(),
  ])
  .transform((value) => (value === 'NULL' ? null : value));

/** Content guidance type after transformation */
export type ContentGuidance = z.infer<typeof contentGuidanceSchema>;


// ============================================================================
// Unit Schemas (bulk-specific structure)
// ============================================================================

/**
 * Schema for thread reference within a unit.
 * @see UnitSummaryResponseSchema.threads
 */
export const unitThreadSchema = z
  .object({
    slug: z.string(),
    order: z.number(),
    title: z.string(),
  })
  .strict();

/** Unit thread reference type */
export type UnitThread = z.infer<typeof unitThreadSchema>;

/**
 * Schema for lesson reference within a unit.
 * @see UnitSummaryResponseSchema.unitLessons
 */
export const unitLessonSchema = z
  .object({
    lessonSlug: z.string(),
    lessonTitle: z.string(),
    lessonOrder: z.number(),
    state: z.string(),
  })
  .strict();

/** Unit lesson reference type */
export type UnitLesson = z.infer<typeof unitLessonSchema>;

/**
 * Schema for exam board reference in KS4 units.
 * Present only in secondary bulk files with KS4 units.
 * Some subjects (e.g., computing) include examSubjectTitle for the GCSE title.
 */
export const examBoardSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    examSubjectTitle: z.string().optional(),
  })
  .strict();

/** Exam board reference type */
export type ExamBoard = z.infer<typeof examBoardSchema>;

/**
 * Schema for unit records in bulk download sequence array.
 *
 * @remarks
 * Structure differs from API UnitSummaryResponseSchema:
 * - Missing: phaseSlug, subjectSlug, notes, categories, canonicalUrl
 * - Added: examBoards (KS4 only)
 * - Required: description (optional in API), year as number or "All years"
 */
export const unitSchema = z
  .object({
    unitSlug: z.string(),
    unitTitle: z.string(),
    threads: z.array(unitThreadSchema),
    priorKnowledgeRequirements: z.array(z.string()),
    nationalCurriculumContent: z.array(z.string()),
    description: z.string(),
    yearSlug: z.string(),
    year: z.union([z.number(), z.literal('All years')]),
    keyStageSlug: z.string(),
    whyThisWhyNow: z.string().optional(),
    unitLessons: z.array(unitLessonSchema),
    examBoards: z.array(examBoardSchema).optional(),
  })
  .strict();

/** Parsed unit type */
export type Unit = z.infer<typeof unitSchema>;


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


// ============================================================================
// Bulk Download File Schema
// ============================================================================


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
  lesson: {
    "additionalFields": [
        "lessonSlug",
        "transcript_sentences",
        "transcript_vtt"
    ],
    "casingDifferences": {
        "downloadsavailable": "downloadsAvailable"
    },
    "nullSentinelFields": [
        "contentGuidance",
        "supervisionLevel"
    ]
},
  unit: {
    "missingFields": [
        "phaseSlug",
        "subjectSlug",
        "notes",
        "categories",
        "canonicalUrl"
    ],
    "addedFields": [
        "examBoards"
    ]
},
} as const;
