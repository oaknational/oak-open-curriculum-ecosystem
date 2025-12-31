/**
 * Helper functions for bulk data transformation.
 *
 * @remarks
 * Extracts and normalises data from bulk download format for ES indexing.
 */

import type { Lesson, Unit } from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { KeyStage } from '../types/oak';

// ============================================================================
// Constants
// ============================================================================

export const BASE_URL = 'https://www.thenational.academy/teachers';

// ============================================================================
// URL Generation
// ============================================================================

/** Generate canonical URL for a lesson */
export function generateLessonUrl(lessonSlug: string): string {
  return `${BASE_URL}/lessons/${lessonSlug}`;
}

/** Generate canonical URL for a unit */
export function generateUnitUrl(unitSlug: string, subjectSlug: string, phaseSlug: string): string {
  return `${BASE_URL}/programmes/${subjectSlug}-${phaseSlug}/units/${unitSlug}`;
}

/** Generate subject programmes URL */
export function generateSubjectProgrammesUrl(subjectSlug: string, keyStageSlug: string): string {
  return `${BASE_URL}/key-stages/${keyStageSlug}/subjects/${subjectSlug}/programmes`;
}

// ============================================================================
// Field Extraction Helpers
// ============================================================================

/** Extract keyword strings from lesson keywords array */
export function extractKeywordStrings(keywords: Lesson['lessonKeywords']): string[] | undefined {
  if (!keywords || keywords.length === 0) {
    return undefined;
  }
  return keywords.map((k) => k.keyword);
}

/** Extract learning point strings */
export function extractLearningPointStrings(
  points: Lesson['keyLearningPoints'],
): string[] | undefined {
  if (!points || points.length === 0) {
    return undefined;
  }
  return points.map((p) => p.keyLearningPoint);
}

/** Extract misconception strings */
export function extractMisconceptionStrings(
  misconceptions: Lesson['misconceptionsAndCommonMistakes'],
): string[] | undefined {
  if (!misconceptions || misconceptions.length === 0) {
    return undefined;
  }
  return misconceptions.map((m) => m.misconception);
}

/** Extract teacher tip strings */
export function extractTeacherTipStrings(tips: Lesson['teacherTips']): string[] | undefined {
  if (!tips || tips.length === 0) {
    return undefined;
  }
  return tips.map((t) => t.teacherTip);
}

/** Extract content guidance labels */
export function extractContentGuidanceLabels(
  guidance: Lesson['contentGuidance'],
): string[] | undefined {
  if (!guidance || !Array.isArray(guidance) || guidance.length === 0) {
    return undefined;
  }
  return guidance.map((g) => g.contentGuidanceLabel);
}

/** Normalise supervision level (null → undefined for ES) */
export function normaliseSupervisionLevel(level: Lesson['supervisionLevel']): string | undefined {
  if (level === null || level === undefined) {
    return undefined;
  }
  return level;
}

/** Derive phase slug from sequence slug */
export function derivePhaseSlug(sequenceSlug: string): string {
  if (sequenceSlug.endsWith('-primary')) {
    return 'primary';
  }
  if (sequenceSlug.endsWith('-secondary')) {
    return 'secondary';
  }
  const parts = sequenceSlug.split('-');
  return parts[parts.length - 1] ?? 'unknown';
}

/** Normalise years from unit year value */
export function normaliseYearsFromUnit(year: Unit['year'], yearSlug: Unit['yearSlug']): string[] {
  if (year === 'All years') {
    return [yearSlug];
  }
  return [String(year)];
}

/** Get display title for key stage */
export function getKeyStageTitle(keyStage: KeyStage): string {
  const titles: Record<KeyStage, string> = {
    ks1: 'Key Stage 1',
    ks2: 'Key Stage 2',
    ks3: 'Key Stage 3',
    ks4: 'Key Stage 4',
  };
  return titles[keyStage];
}

// ============================================================================
// Subject Slug Normalisation
// ============================================================================

/**
 * Maps bulk data subject variants to API subject slugs.
 *
 * @remarks
 * Bulk download files may contain KS4 science variants (biology, chemistry,
 * physics, combined-science) that map to the parent 'science' subject.
 * The API's subject parameter only accepts the base subjects.
 */
const BULK_SUBJECT_TO_API_SUBJECT: Readonly<Record<string, string>> = {
  // KS4 science variants all map to 'science'
  'combined-science': 'science',
  biology: 'science',
  chemistry: 'science',
  physics: 'science',
};

/**
 * Normalise a bulk subject slug to an API subject slug.
 *
 * @remarks
 * Some bulk files contain subject variants (e.g., 'combined-science', 'biology')
 * that are not valid API subject parameters. This function maps them to their
 * parent API subject.
 *
 * @param bulkSubjectSlug - Subject slug from bulk download data
 * @returns Normalised API subject slug, or the original if no mapping needed
 *
 * @example
 * ```ts
 * normaliseSubjectSlug('combined-science'); // 'science'
 * normaliseSubjectSlug('maths'); // 'maths'
 * ```
 */
export function normaliseSubjectSlug(bulkSubjectSlug: string): string {
  return BULK_SUBJECT_TO_API_SUBJECT[bulkSubjectSlug] ?? bulkSubjectSlug;
}
