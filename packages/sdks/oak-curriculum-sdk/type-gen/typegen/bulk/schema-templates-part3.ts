/**
 * Template strings for bulk schema generation (part 3).
 *
 * @remarks
 * Contains unit-related Zod schema code templates.
 * Separated for maintainability and to stay under max-lines lint rule.
 *
 * @module type-gen/typegen/bulk/schema-templates-part3
 */

/** Unit schemas template */
export const UNIT_TEMPLATE = `
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
`;
