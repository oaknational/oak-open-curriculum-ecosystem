/**
 * Canonical URL generation for Oak curriculum content.
 *
 * This module is the **single source of truth** for generating canonical URLs
 * across all content types in search-CLI. All document builders should use
 * these functions to ensure consistent URL patterns.
 *
 * @remarks
 * URL helpers delegate to the SDK's generated `generateCanonicalUrlWithContext`
 * to ensure a single source of truth and avoid pattern drift.
 *
 * URL patterns (confirmed against OWA source and live site 2026-03-05):
 * - Lessons: `/teachers/lessons/{lessonSlug}`
 * - Units: `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}`
 * - Sequences: `/teachers/curriculum/{sequenceSlug}/units`
 * - Threads: no OWA page, returns `null`
 * - Subject programmes: `/teachers/key-stages/{keyStageSlug}/subjects/{subjectSlug}/programmes`
 *
 * @see ADR-047 Canonical URL Generation at Codegen Time
 */
import { generateCanonicalUrlWithContext } from '@oaknational/sdk-codegen/api-schema';
import { deriveSequenceSlug } from '@oaknational/curriculum-sdk';

/**
 * Base URL for all Oak curriculum teacher-facing content.
 *
 * @example
 * ```typescript
 * const lessonUrl = `${OAK_BASE_URL}/lessons/${lessonSlug}`;
 * ```
 */
export const OAK_BASE_URL = 'https://www.thenational.academy/teachers';

/**
 * Generates the canonical URL for a lesson.
 *
 * @param lessonSlug - The lesson's slug identifier
 * @returns Fully qualified canonical URL for the lesson
 *
 * @example
 * ```typescript
 * const url = generateLessonCanonicalUrl('adding-fractions-with-same-denominator');
 * // => 'https://www.thenational.academy/teachers/lessons/adding-fractions-with-same-denominator'
 * ```
 */
export function generateLessonCanonicalUrl(lessonSlug: string): string {
  return `${OAK_BASE_URL}/lessons/${lessonSlug}`;
}

/**
 * Generates the canonical URL for a unit within its curriculum context.
 *
 * The `sequenceSlug` is the combined subject+phase identifier (e.g. `maths-primary`).
 * It is derived from `subjectSlug + '-' + phaseSlug` by the caller.
 *
 * @param unitSlug - The unit's slug identifier
 * @param subjectSlug - The subject slug (e.g., 'maths', 'design-technology')
 * @param phaseSlug - The phase slug ('primary' or 'secondary')
 * @returns Fully qualified canonical URL for the unit
 *
 * @example
 * ```typescript
 * const url = generateUnitCanonicalUrl('fractions-year-5', 'maths', 'primary');
 * // => 'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-year-5'
 * ```
 */
export function generateUnitCanonicalUrl(
  unitSlug: string,
  subjectSlug: string,
  phaseSlug: string,
): string {
  const sequenceSlug = deriveSequenceSlug(subjectSlug, phaseSlug);
  return generateUnitCanonicalUrlFromSequence(unitSlug, sequenceSlug);
}

/**
 * Generates the canonical URL for a unit when the full sequence slug is known.
 *
 * Use this helper for bulk/indexing flows where `sequenceSlug` is already
 * available on the source payload (including exam-board variants).
 */
export function generateUnitCanonicalUrlFromSequence(
  unitSlug: string,
  sequenceSlug: string,
): string {
  const url = generateCanonicalUrlWithContext('unit', unitSlug, { unit: { sequenceSlug } });
  if (url === null) {
    throw new TypeError(
      `generateUnitCanonicalUrl: expected non-null URL for unit "${unitSlug}" with sequenceSlug "${sequenceSlug}"`,
    );
  }
  return url;
}

/**
 * Generates the canonical URL for a sequence (curriculum programme).
 *
 * @param sequenceSlug - The sequence's slug identifier (e.g., 'maths-primary')
 * @returns Fully qualified canonical URL for the sequence
 *
 * @example
 * ```typescript
 * const url = generateSequenceCanonicalUrl('maths-primary');
 * // => 'https://www.thenational.academy/teachers/curriculum/maths-primary/units'
 * ```
 */
export function generateSequenceCanonicalUrl(sequenceSlug: string): string {
  const url = generateCanonicalUrlWithContext('sequence', sequenceSlug);
  if (url === null) {
    throw new TypeError(
      `generateSequenceCanonicalUrl: expected non-null URL for sequence "${sequenceSlug}"`,
    );
  }
  return url;
}

/**
 * Threads have no pages on the Oak website.
 *
 * Thread "highlighting" is client-side within programme/unit pages.
 * This function always returns `null` to signal no canonical URL exists.
 *
 * The `threadSlug` parameter is retained for API compatibility with callers
 * that may still pass a slug; its value is not used.
 *
 * @returns `null` — threads have no OWA canonical page
 */
export function generateThreadCanonicalUrl(threadSlug: string): null {
  void threadSlug;
  return null;
}

/**
 * Generates the URL for a subject's programmes page within a key stage.
 *
 * @param subjectSlug - The subject's slug identifier
 * @param keyStageSlug - The key stage slug (e.g., 'ks2', 'ks3')
 * @returns Fully qualified URL for the subject's programmes page
 *
 * @example
 * ```typescript
 * const url = generateSubjectProgrammesUrl('maths', 'ks2');
 * // => 'https://www.thenational.academy/teachers/key-stages/ks2/subjects/maths/programmes'
 * ```
 */
export function generateSubjectProgrammesUrl(subjectSlug: string, keyStageSlug: string): string {
  return `${OAK_BASE_URL}/key-stages/${keyStageSlug}/subjects/${subjectSlug}/programmes`;
}
