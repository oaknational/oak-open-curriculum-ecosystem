/**
 * Bulk data manifest with generation metadata.
 *
 * @generated - DO NOT EDIT
 * Generated at: 2026-04-02T14:20:30.829Z
 */

/**
 * Metadata for a subject/phase combination.
 */
interface SubjectPhaseMetadata {
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
    lessonCount: 238,
  },
  {
    subject: 'art',
    phase: 'secondary',
    sequenceSlug: 'art-secondary',
    lessonCount: 200,
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
    lessonCount: 1518,
  },
  {
    subject: 'english',
    phase: 'secondary',
    sequenceSlug: 'english-secondary',
    lessonCount: 1041,
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
    lessonCount: 234,
  },
  {
    subject: 'geography',
    phase: 'secondary',
    sequenceSlug: 'geography-secondary',
    lessonCount: 459,
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
    lessonCount: 216,
  },
  {
    subject: 'history',
    phase: 'secondary',
    sequenceSlug: 'history-secondary',
    lessonCount: 463,
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
    lessonCount: 863,
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
    lessonCount: 888,
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

/** Number of subject/phase combinations */
export const SUBJECT_PHASE_COUNT = 30 as const;