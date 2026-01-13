/**
 * Bulk data manifest with generation metadata.
 *
 * @generated - DO NOT EDIT
 * Generated at: 2026-01-10T22:25:17.231Z
 *
 * @packageDocumentation
 */

/**
 * Metadata for a subject/phase combination.
 */
export interface SubjectPhaseMetadata {
  readonly subject: string;
  readonly phase: 'primary' | 'secondary';
  readonly sequenceSlug: string;
  readonly lessonCount: number;
}

/**
 * All subject/phase combinations in the bulk data.
 */
export const BULK_DATA_MANIFEST: readonly SubjectPhaseMetadata[] = [
  {
    subject: 'art',
    phase: 'primary',
    sequenceSlug: 'art-primary',
    lessonCount: 214,
  },
  {
    subject: 'art',
    phase: 'secondary',
    sequenceSlug: 'art-secondary',
    lessonCount: 204,
  },
  {
    subject: 'citizenship',
    phase: 'secondary',
    sequenceSlug: 'citizenship-secondary',
    lessonCount: 318,
  },
  {
    subject: 'computing',
    phase: 'primary',
    sequenceSlug: 'computing-primary',
    lessonCount: 180,
  },
  {
    subject: 'computing',
    phase: 'secondary',
    sequenceSlug: 'computing-secondary',
    lessonCount: 348,
  },
  {
    subject: 'cooking-nutrition',
    phase: 'primary',
    sequenceSlug: 'cooking-nutrition-primary',
    lessonCount: 72,
  },
  {
    subject: 'cooking-nutrition',
    phase: 'secondary',
    sequenceSlug: 'cooking-nutrition-secondary',
    lessonCount: 36,
  },
  {
    subject: 'design-technology',
    phase: 'primary',
    sequenceSlug: 'design-technology-primary',
    lessonCount: 144,
  },
  {
    subject: 'design-technology',
    phase: 'secondary',
    sequenceSlug: 'design-technology-secondary',
    lessonCount: 216,
  },
  {
    subject: 'english',
    phase: 'primary',
    sequenceSlug: 'english-primary',
    lessonCount: 1512,
  },
  {
    subject: 'english',
    phase: 'secondary',
    sequenceSlug: 'english-secondary',
    lessonCount: 1028,
  },
  {
    subject: 'french',
    phase: 'primary',
    sequenceSlug: 'french-primary',
    lessonCount: 105,
  },
  {
    subject: 'french',
    phase: 'secondary',
    sequenceSlug: 'french-secondary',
    lessonCount: 417,
  },
  {
    subject: 'geography',
    phase: 'primary',
    sequenceSlug: 'geography-primary',
    lessonCount: 223,
  },
  {
    subject: 'geography',
    phase: 'secondary',
    sequenceSlug: 'geography-secondary',
    lessonCount: 460,
  },
  {
    subject: 'german',
    phase: 'secondary',
    sequenceSlug: 'german-secondary',
    lessonCount: 411,
  },
  {
    subject: 'history',
    phase: 'primary',
    sequenceSlug: 'history-primary',
    lessonCount: 218,
  },
  {
    subject: 'history',
    phase: 'secondary',
    sequenceSlug: 'history-secondary',
    lessonCount: 439,
  },
  {
    subject: 'maths',
    phase: 'primary',
    sequenceSlug: 'maths-primary',
    lessonCount: 1072,
  },
  {
    subject: 'maths',
    phase: 'secondary',
    sequenceSlug: 'maths-secondary',
    lessonCount: 862,
  },
  {
    subject: 'music',
    phase: 'primary',
    sequenceSlug: 'music-primary',
    lessonCount: 216,
  },
  {
    subject: 'music',
    phase: 'secondary',
    sequenceSlug: 'music-secondary',
    lessonCount: 218,
  },
  {
    subject: 'physical-education',
    phase: 'primary',
    sequenceSlug: 'physical-education-primary',
    lessonCount: 432,
  },
  {
    subject: 'physical-education',
    phase: 'secondary',
    sequenceSlug: 'physical-education-secondary',
    lessonCount: 560,
  },
  {
    subject: 'religious-education',
    phase: 'primary',
    sequenceSlug: 'religious-education-primary',
    lessonCount: 216,
  },
  {
    subject: 'religious-education',
    phase: 'secondary',
    sequenceSlug: 'religious-education-secondary',
    lessonCount: 395,
  },
  {
    subject: 'science',
    phase: 'primary',
    sequenceSlug: 'science-primary',
    lessonCount: 390,
  },
  {
    subject: 'science',
    phase: 'secondary',
    sequenceSlug: 'science-secondary',
    lessonCount: 889,
  },
  {
    subject: 'spanish',
    phase: 'primary',
    sequenceSlug: 'spanish-primary',
    lessonCount: 112,
  },
  {
    subject: 'spanish',
    phase: 'secondary',
    sequenceSlug: 'spanish-secondary',
    lessonCount: 413,
  },
] as const;

/** Total number of lessons across all subjects */
export const TOTAL_LESSON_COUNT = 12320 as const;

/** Number of subject/phase combinations */
export const SUBJECT_PHASE_COUNT = 30 as const;

/** Generation timestamp */
export const GENERATED_AT = '2026-01-10T22:25:17.231Z' as const;