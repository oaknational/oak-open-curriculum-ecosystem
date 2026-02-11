/**
 * Canonical URL generation for Oak curriculum content.
 *
 * This module is the **single source of truth** for generating canonical URLs
 * across all content types. All document builders should use these functions
 * to ensure consistent URL patterns.
 *
 * @remarks
 * All URLs follow the pattern: `https://www.thenational.academy/teachers/...`
 *
 * URL patterns:
 * - Lessons: `/teachers/lessons/{lessonSlug}`
 * - Units: `/teachers/programmes/{subjectSlug}-{phaseSlug}/units/{unitSlug}`
 * - Sequences: `/teachers/programmes/{sequenceSlug}/units`
 * - Threads: `/teachers/curriculum/threads/{threadSlug}`
 * - Subject programmes: `/teachers/key-stages/{keyStageSlug}/subjects/{subjectSlug}/programmes`
 *
 * @see ADR-xxx Canonical URL Generation (if applicable)
 * @module lib/indexing/canonical-url-generator
 */

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
 * Generates the canonical URL for a unit.
 *
 * @param unitSlug - The unit's slug identifier
 * @param subjectSlug - The subject slug (e.g., 'maths', 'design-technology')
 * @param phaseSlug - The phase slug ('primary' or 'secondary')
 * @returns Fully qualified canonical URL for the unit
 *
 * @example
 * ```typescript
 * const url = generateUnitCanonicalUrl('fractions-year-5', 'maths', 'primary');
 * // => 'https://www.thenational.academy/teachers/programmes/maths-primary/units/fractions-year-5'
 * ```
 */
export function generateUnitCanonicalUrl(
  unitSlug: string,
  subjectSlug: string,
  phaseSlug: string,
): string {
  return `${OAK_BASE_URL}/programmes/${subjectSlug}-${phaseSlug}/units/${unitSlug}`;
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
 * // => 'https://www.thenational.academy/teachers/programmes/maths-primary/units'
 * ```
 */
export function generateSequenceCanonicalUrl(sequenceSlug: string): string {
  return `${OAK_BASE_URL}/programmes/${sequenceSlug}/units`;
}

/**
 * Generates the canonical URL for a curriculum thread.
 *
 * @param threadSlug - The thread's slug identifier
 * @returns Fully qualified canonical URL for the thread
 *
 * @example
 * ```typescript
 * const url = generateThreadCanonicalUrl('number-multiplication-and-division');
 * // => 'https://www.thenational.academy/teachers/curriculum/threads/number-multiplication-and-division'
 * ```
 */
export function generateThreadCanonicalUrl(threadSlug: string): string {
  return `${OAK_BASE_URL}/curriculum/threads/${threadSlug}`;
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
