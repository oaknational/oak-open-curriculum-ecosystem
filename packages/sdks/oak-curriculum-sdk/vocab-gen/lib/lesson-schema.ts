/**
 * Zod schema for complete lesson records in Oak bulk download data.
 *
 * @remarks
 * Lessons are the primary source of vocabulary data:
 * - Keywords with definitions
 * - Key learning points
 * - Misconceptions and responses
 * - Teacher tips
 *
 * @see 07-bulk-download-data-quality-report.md for data quality analysis
 */
import { z } from 'zod';

import { contentGuidanceSchema } from './content-guidance-schema.js';
import {
  keyLearningPointSchema,
  lessonKeywordSchema,
  misconceptionSchema,
  nullSentinelSchema,
  teacherTipSchema,
} from './vocabulary-schemas.js';

/**
 * Schema for a complete lesson record from bulk download.
 *
 * @remarks
 * Includes all vocabulary-relevant fields for extraction:
 * - lessonKeywords: Terms with definitions
 * - keyLearningPoints: Learning outcomes
 * - misconceptionsAndCommonMistakes: Common mistakes to address
 * - teacherTips: Pedagogical guidance
 */
export const lessonSchema = z.object({
  /** Human-readable lesson title */
  lessonTitle: z.string(),
  /** Lesson slug identifier */
  lessonSlug: z.string(),
  /** Parent unit slug */
  unitSlug: z.string(),
  /** Parent unit title */
  unitTitle: z.string(),
  /** Subject slug */
  subjectSlug: z.string(),
  /** Subject title */
  subjectTitle: z.string(),
  /** Key stage slug */
  keyStageSlug: z.string(),
  /** Key stage title */
  keyStageTitle: z.string(),
  /** Keywords with definitions */
  lessonKeywords: z.array(lessonKeywordSchema),
  /** Key learning points */
  keyLearningPoints: z.array(keyLearningPointSchema),
  /** Misconceptions and how to address them */
  misconceptionsAndCommonMistakes: z.array(misconceptionSchema),
  /** Expected outcome for pupils */
  pupilLessonOutcome: z.string(),
  /** Teacher guidance */
  teacherTips: z.array(teacherTipSchema),
  /** Content guidance (handles NULL sentinel) */
  contentGuidance: contentGuidanceSchema,
  /** Whether downloads are available */
  downloadsavailable: z.boolean(),
  /** Supervision level (handles NULL sentinel) */
  supervisionLevel: nullSentinelSchema,
  /** Transcript text (optional - some lessons missing) */
  transcript_sentences: z.string().optional(),
  /** VTT captions (optional) */
  transcript_vtt: z.string().optional(),
});

// ============================================================================
// Derived Types
// ============================================================================

/** Type for a parsed lesson */
export type Lesson = z.infer<typeof lessonSchema>;
