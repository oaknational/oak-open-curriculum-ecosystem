/**
 * Zod schemas for unit-related structures in Oak bulk download data.
 *
 * @remarks
 * Units are collections of lessons organised into coherent teaching blocks.
 * They contain:
 * - Thread references (conceptual strands linking related units)
 * - Prior knowledge requirements
 * - National curriculum coverage
 * - Lesson references
 *
 * @see 07-bulk-download-data-quality-report.md for data quality analysis
 */
import { z } from 'zod';

/**
 * Schema for a thread reference within a unit.
 */
export const unitThreadSchema = z.object({
  /** Thread slug identifier */
  slug: z.string(),
  /** Order within the thread progression */
  order: z.number(),
  /** Human-readable thread title */
  title: z.string(),
});

/**
 * Schema for a lesson reference within a unit.
 */
export const unitLessonSchema = z.object({
  /** Lesson slug identifier */
  lessonSlug: z.string(),
  /** Human-readable lesson title */
  lessonTitle: z.string(),
  /** Order within the unit */
  lessonOrder: z.number(),
  /** Publication state */
  state: z.string(),
});

/**
 * Schema for a complete unit record from bulk download sequence.
 *
 * @remarks
 * Contains unit-level vocabulary data:
 * - threads: Conceptual strands linking units
 * - priorKnowledgeRequirements: Prerequisites
 * - nationalCurriculumContent: NC statement coverage
 */
export const unitSchema = z.object({
  /** Unit slug identifier */
  unitSlug: z.string(),
  /** Human-readable unit title */
  unitTitle: z.string(),
  /** Threads this unit belongs to */
  threads: z.array(unitThreadSchema),
  /** Prior knowledge required */
  priorKnowledgeRequirements: z.array(z.string()),
  /** National curriculum statements covered */
  nationalCurriculumContent: z.array(z.string()),
  /** Unit description (can be empty string) */
  description: z.string(),
  /** Year slug */
  yearSlug: z.string(),
  /**
   * Year number or "All years" for PE swimming units.
   *
   * @remarks
   * Most units have a numeric year (1-11), but PE swimming units
   * use "All years" as they span multiple year groups.
   */
  year: z.union([z.number(), z.literal('All years')]),
  /** Key stage slug */
  keyStageSlug: z.string(),
  /** Rationale for unit placement (optional - some units have undefined) */
  whyThisWhyNow: z.string().optional(),
  /** Lessons in this unit */
  unitLessons: z.array(unitLessonSchema),
});

// ============================================================================
// Derived Types
// ============================================================================

/** Type for a parsed unit thread */
export type UnitThread = z.infer<typeof unitThreadSchema>;

/** Type for a parsed unit lesson reference */
export type UnitLesson = z.infer<typeof unitLessonSchema>;

/** Type for a parsed unit */
export type Unit = z.infer<typeof unitSchema>;
