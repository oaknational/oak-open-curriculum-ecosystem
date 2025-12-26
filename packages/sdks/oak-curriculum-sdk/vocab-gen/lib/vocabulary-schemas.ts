/**
 * Zod schemas for vocabulary-related fields in Oak bulk download data.
 *
 * @remarks
 * These schemas handle individual vocabulary items extracted from lessons:
 * - Keywords with definitions
 * - Key learning points
 * - Misconceptions and responses
 * - Teacher tips
 *
 * @see 07-bulk-download-data-quality-report.md for data quality analysis
 */
import { z } from 'zod';

/**
 * Schema that transforms NULL sentinel strings to undefined.
 *
 * @remarks
 * The bulk download uses string "NULL" instead of JSON null for absent values.
 * This schema normalises them to undefined for cleaner downstream processing.
 */
export const nullSentinelSchema = z.union([
  z.literal('NULL').transform(() => undefined),
  z.null().transform(() => undefined),
  z.string(),
]);

/**
 * Schema for a lesson keyword with its definition.
 *
 * @example
 * ```ts
 * { keyword: 'photosynthesis', description: 'The process by which plants make food.' }
 * ```
 */
export const lessonKeywordSchema = z.object({
  /** The vocabulary term */
  keyword: z.string(),
  /** Definition or description of the term */
  description: z.string(),
});

/**
 * Schema for key learning points in a lesson.
 */
export const keyLearningPointSchema = z.object({
  /** The key learning outcome */
  keyLearningPoint: z.string(),
});

/**
 * Schema for misconceptions and common mistakes.
 */
export const misconceptionSchema = z.object({
  /** The incorrect belief or common mistake */
  misconception: z.string(),
  /** How to address or correct the misconception */
  response: z.string(),
});

/**
 * Schema for teacher tips in a lesson.
 */
export const teacherTipSchema = z.object({
  /** Pedagogical guidance for teachers */
  teacherTip: z.string(),
});

// ============================================================================
// Derived Types
// ============================================================================

/** Type for a parsed lesson keyword */
export type LessonKeyword = z.infer<typeof lessonKeywordSchema>;

/** Type for a parsed key learning point */
export type KeyLearningPoint = z.infer<typeof keyLearningPointSchema>;

/** Type for a parsed misconception */
export type Misconception = z.infer<typeof misconceptionSchema>;

/** Type for a parsed teacher tip */
export type TeacherTip = z.infer<typeof teacherTipSchema>;
