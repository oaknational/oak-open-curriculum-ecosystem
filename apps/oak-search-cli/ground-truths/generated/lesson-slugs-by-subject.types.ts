/**
 * Types for the JSON-backed lesson slug dataset.
 *
 * @generated - DO NOT EDIT
 */

export interface LessonSlugDatasetSequenceData {
  readonly subject: string;
  readonly phase: 'primary' | 'secondary';
  readonly sequenceSlug: string;
  readonly lessonCount: number;
  readonly lessonSlugs: readonly string[];
}

export interface LessonSlugDataset {
  readonly generatedAt: string;
  readonly totalLessonSlugCount: number;
  readonly sequenceOrder: readonly string[];
  readonly allLessonSlugs: readonly string[];
  readonly sequences: Readonly<Record<string, LessonSlugDatasetSequenceData>>;
}