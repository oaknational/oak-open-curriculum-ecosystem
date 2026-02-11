/**
 * Helper functions for bulk data transformation.
 *
 * @remarks
 * Extracts and normalises data from bulk download format for ES indexing.
 *
 * URL generation and slug derivation are re-exported from shared modules
 * for backwards compatibility.
 *
 * @see canonical-url-generator.ts - Shared URL generation (single source of truth)
 * @see slug-derivation.ts - Shared slug derivation (single source of truth)
 */

import type { Lesson, Unit } from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { KeyStage } from '../types/oak';

// ============================================================================
// Re-exports from shared modules (DRY - single source of truth)
// ============================================================================

export {
  OAK_BASE_URL as BASE_URL,
  generateLessonCanonicalUrl as generateLessonUrl,
  generateUnitCanonicalUrl as generateUnitUrl,
  generateSubjectProgrammesUrl,
  generateSequenceCanonicalUrl,
  generateThreadCanonicalUrl,
} from '../lib/indexing/canonical-url-generator';

export {
  deriveSubjectSlugFromSequence,
  derivePhaseSlugFromSequence,
} from '../lib/indexing/slug-derivation';

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

// Note: derivePhaseSlug is now re-exported as derivePhaseSlugFromSequence from slug-derivation.ts
// Keeping alias for backwards compatibility
export { derivePhaseSlugFromSequence as derivePhaseSlug } from '../lib/indexing/slug-derivation';

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
 * KS4 science variants that exist in bulk data but not in the API.
 * These map to the parent 'science' subject for filtering purposes.
 * @see ADR-101 Subject Hierarchy for Search Filtering
 */
export const KS4_SCIENCE_VARIANTS = [
  'biology',
  'chemistry',
  'physics',
  'combined-science',
] as const;

/**
 * Type for KS4 science variant slugs.
 */
export type Ks4ScienceVariant = (typeof KS4_SCIENCE_VARIANTS)[number];

/**
 * Type guard for KS4 science variants.
 */
export function isKs4ScienceVariant(value: string): value is Ks4ScienceVariant {
  const variants: readonly string[] = KS4_SCIENCE_VARIANTS;
  return variants.includes(value);
}

/**
 * Maps bulk data subject variants to API subject slugs.
 *
 * @remarks
 * Bulk download files may contain KS4 science variants (biology, chemistry,
 * physics, combined-science) that map to the parent 'science' subject.
 * The API's subject parameter only accepts the base subjects.
 */
const BULK_SUBJECT_TO_API_SUBJECT: Readonly<Record<Ks4ScienceVariant, 'science'>> = {
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
  if (isKs4ScienceVariant(bulkSubjectSlug)) {
    return BULK_SUBJECT_TO_API_SUBJECT[bulkSubjectSlug];
  }
  return bulkSubjectSlug;
}
