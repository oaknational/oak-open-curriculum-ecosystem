/**
 * Template strings for bulk schema generation.
 *
 * @remarks
 * Contains the Zod schema code templates used by the bulk schema generator.
 * Separated for maintainability and to stay under max-lines lint rule.

 */

/**
 * Bulk download lesson fields that differ from API LessonSummaryResponseSchema.
 *
 * @remarks
 * API schema has: lessonTitle, unitSlug, unitTitle, subjectSlug, subjectTitle,
 * keyStageSlug, keyStageTitle, lessonKeywords, keyLearningPoints,
 * misconceptionsAndCommonMistakes, pupilLessonOutcome, teacherTips,
 * contentGuidance, supervisionLevel, downloadsAvailable, canonicalUrl (upstream), oakUrl (SDK)
 *
 * Bulk adds: lessonSlug, transcript_sentences, transcript_vtt
 * Bulk changes: downloadsavailable (lowercase) vs downloadsAvailable
 * Bulk changes: contentGuidance/supervisionLevel use "NULL" string sentinel
 */
export const BULK_LESSON_DELTA = {
  additionalFields: ['lessonSlug', 'transcript_sentences', 'transcript_vtt'],
  casingDifferences: { downloadsavailable: 'downloadsAvailable' },
  nullSentinelFields: ['contentGuidance', 'supervisionLevel'],
} as const;

/**
 * Bulk download unit fields - structure differs from API UnitSummaryResponseSchema.
 */
export const BULK_UNIT_DELTA = {
  missingFields: ['phaseSlug', 'subjectSlug', 'notes', 'categories', 'canonicalUrl', 'oakUrl'],
  addedFields: ['examBoards'],
} as const;

/** File header template */
export const HEADER_TEMPLATE = `/**
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
`;

/** NULL sentinel schema template */
export const NULL_SENTINEL_TEMPLATE = `
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
`;

/** Vocabulary schemas template */
export const VOCABULARY_TEMPLATE = `
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
`;

/** Content guidance schema template */
export const CONTENT_GUIDANCE_TEMPLATE = `
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
`;
