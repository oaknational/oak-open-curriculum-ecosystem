/**
 * Generated lesson slug validation data from bulk download files.
 *
 * Provides runtime validation Sets and type guards for ground truth lesson slugs.
 * Uses a JSON-backed loader to avoid monolithic generated TypeScript data files.
 *
 * @generated - DO NOT EDIT
 * Generated at: 2026-04-02T14:20:30.825Z
 */

import rawLessonSlugData from './lesson-slugs-by-subject.data.json';
import { typeSafeEntries } from '@oaknational/type-helpers';
import type { LessonSlugDataset, LessonSlugDatasetSequenceData } from './lesson-slugs-by-subject.types.js';

function parseLessonSlugPhase(phase: string): LessonSlugDatasetSequenceData['phase'] {
  if (phase === 'primary' || phase === 'secondary') {
    return phase;
  }
  throw new Error(`Invalid lesson slug dataset phase: ${phase}`);
}

function loadLessonSlugData(): LessonSlugDataset {
  const sequences: Record<string, LessonSlugDatasetSequenceData> = {};
  for (const [sequenceSlug, sequenceData] of typeSafeEntries(rawLessonSlugData.sequences)) {
    sequences[sequenceSlug] = {
      subject: sequenceData.subject,
      phase: parseLessonSlugPhase(sequenceData.phase),
      sequenceSlug: sequenceData.sequenceSlug,
      lessonCount: sequenceData.lessonCount,
      lessonSlugs: sequenceData.lessonSlugs,
    };
  }

  return {
    generatedAt: rawLessonSlugData.generatedAt,
    totalLessonSlugCount: rawLessonSlugData.totalLessonSlugCount,
    sequenceOrder: rawLessonSlugData.sequenceOrder,
    allLessonSlugs: rawLessonSlugData.allLessonSlugs,
    sequences,
  };
}

const lessonSlugData = loadLessonSlugData();

export type { LessonSlugDataset, LessonSlugDatasetSequenceData } from './lesson-slugs-by-subject.types.js';

/**
 * Branded string type for validated lesson slugs.
 *
 * Use isValidLessonSlug() to validate and narrow strings to this type.
 *
 * @generated
 */
export type AnyLessonSlug = string & { readonly __brand: 'LessonSlug' };

function getSequenceData(sequenceSlug: string): LessonSlugDatasetSequenceData {
  const sequenceData = lessonSlugData.sequences[sequenceSlug];
  if (sequenceData === undefined) {
    throw new Error(`Missing lesson slug data for sequence: ${sequenceSlug}`);
  }
  return sequenceData;
}

/**
 * Combined Set of all valid lesson slugs for runtime validation.
 *
 * Total slugs: 12391
 *
 * @generated
 */
export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set(lessonSlugData.allLessonSlugs);

/**
 * Type guard to check if a string is a valid lesson slug.
 *
 * @param value - String to check
 * @returns True if value is a valid lesson slug
 *
 * @example
 * ```typescript
 * if (isValidLessonSlug('adding-fractions')) {
 *   // value is narrowed to AnyLessonSlug
 * }
 * ```
 */
export function isValidLessonSlug(value: string): value is AnyLessonSlug {
  return ALL_LESSON_SLUGS.has(value);
}

/** Total lessons across all subjects */
export const TOTAL_LESSON_SLUG_COUNT = 12391 as const;

function buildSlugToSubjectMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const sequenceSlug of lessonSlugData.sequenceOrder) {
    const sequenceData = getSequenceData(sequenceSlug);
    for (const lessonSlug of sequenceData.lessonSlugs) {
      map.set(lessonSlug, sequenceData.subject);
    }
  }
  return map;
}

export const SLUG_TO_SUBJECT: ReadonlyMap<string, string> = buildSlugToSubjectMap();

/**
 * Get the subject for a given lesson slug.
 *
 * @param slug - Lesson slug to look up
 * @returns Subject slug, or undefined if slug not found
 *
 * @example
 * ```typescript
 * getSubjectForSlug('adding-fractions'); // 'maths'
 * getSubjectForSlug('photosynthesis'); // 'science'
 * ```
 */
export function getSubjectForSlug(slug: string): string | undefined {
  return SLUG_TO_SUBJECT.get(slug);
}