/**
 * Convenience URL generators for Oak curriculum content.
 *
 * These functions produce slug-based teacher-facing URLs for the
 * Oak National Academy website. They wrap the lower-level
 * {@link generateOakUrlWithContext} from `@oaknational/sdk-codegen`
 * with domain-specific parameters and sequence slug derivation.
 *
 * URL patterns (confirmed against OWA source and live site 2026-03-05):
 * - Lessons: `/teachers/lessons/{lessonSlug}`
 * - Units: `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}`
 * - Sequences: `/teachers/curriculum/{sequenceSlug}/units`
 * - Threads: no OWA page, returns `null`
 * - Subject programmes: `/teachers/key-stages/{keyStageSlug}/subjects/{subjectSlug}/programmes`
 *
 * @see ADR-047 Canonical URL Generation at Codegen Time
 * @see ADR-145 Oak URL Naming Collision Remediation
 */
import { generateOakUrlWithContext } from '@oaknational/sdk-codegen/api-schema';

import { deriveSequenceSlug } from './sequence-slug-derivation.js';

/**
 * Base URL for all Oak curriculum teacher-facing content.
 *
 * @example
 * ```typescript
 * const url = generateLessonOakUrl('example-lesson');
 * // => 'https://www.thenational.academy/teachers/lessons/example-lesson'
 * ```
 */
export const OAK_BASE_URL = 'https://www.thenational.academy/teachers';

/**
 * Generates the Oak URL for a lesson.
 *
 * @param lessonSlug - The lesson's slug identifier
 * @returns Fully qualified Oak URL for the lesson
 *
 * @example
 * ```typescript
 * const url = generateLessonOakUrl('adding-fractions-with-same-denominator');
 * // => 'https://www.thenational.academy/teachers/lessons/adding-fractions-with-same-denominator'
 * ```
 */
export function generateLessonOakUrl(lessonSlug: string): string {
  const url = generateOakUrlWithContext('lesson', lessonSlug);
  if (url === null) {
    throw new TypeError(`generateLessonOakUrl: expected non-null URL for lesson "${lessonSlug}"`);
  }
  return url;
}

/**
 * Generates the Oak URL for a unit within its curriculum context.
 *
 * The `sequenceSlug` is the combined subject+phase identifier (e.g. `maths-primary`).
 * It is derived from `subjectSlug + '-' + phaseSlug` by the caller.
 *
 * @param unitSlug - The unit's slug identifier
 * @param subjectSlug - The subject slug (e.g., 'maths', 'design-technology')
 * @param phaseSlug - The phase slug ('primary' or 'secondary')
 * @returns Fully qualified Oak URL for the unit
 *
 * @example
 * ```typescript
 * const url = generateUnitOakUrl('fractions-year-5', 'maths', 'primary');
 * // => 'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-year-5'
 * ```
 */
export function generateUnitOakUrl(
  unitSlug: string,
  subjectSlug: string,
  phaseSlug: string,
): string {
  const sequenceSlug = deriveSequenceSlug(subjectSlug, phaseSlug);
  return generateUnitOakUrlFromSequence(unitSlug, sequenceSlug);
}

/**
 * Generates the Oak URL for a unit when the full sequence slug is known.
 *
 * Use this helper for bulk/indexing flows where `sequenceSlug` is already
 * available on the source payload (including exam-board variants).
 */
export function generateUnitOakUrlFromSequence(unitSlug: string, sequenceSlug: string): string {
  const url = generateOakUrlWithContext('unit', unitSlug, { unit: { sequenceSlug } });
  if (url === null) {
    throw new TypeError(
      `generateUnitOakUrl: expected non-null URL for unit "${unitSlug}" with sequenceSlug "${sequenceSlug}"`,
    );
  }
  return url;
}

/**
 * Generates the Oak URL for a sequence (curriculum programme).
 *
 * @param sequenceSlug - The sequence's slug identifier (e.g., 'maths-primary')
 * @returns Fully qualified Oak URL for the sequence
 *
 * @example
 * ```typescript
 * const url = generateSequenceOakUrl('maths-primary');
 * // => 'https://www.thenational.academy/teachers/curriculum/maths-primary/units'
 * ```
 */
export function generateSequenceOakUrl(sequenceSlug: string): string {
  const url = generateOakUrlWithContext('sequence', sequenceSlug);
  if (url === null) {
    throw new TypeError(
      `generateSequenceOakUrl: expected non-null URL for sequence "${sequenceSlug}"`,
    );
  }
  return url;
}

/**
 * Threads have no pages on the Oak website.
 *
 * Thread "highlighting" is client-side within programme/unit pages.
 * This function always returns `null` to signal no Oak URL exists.
 *
 * @returns `null` — threads have no OWA page
 */
export function generateThreadOakUrl(): null {
  return null;
}

/**
 * Generates the URL for a subject's programmes page within a key stage.
 *
 * @remarks
 * This function deliberately does not delegate to
 * {@link generateOakUrlWithContext} because the generated `urlForSubject`
 * path has different semantics: it takes an array of key stage slugs and
 * applies heuristics to select a preferred one (ks1 \> ks2 \> ks3 \> ks4),
 * whereas this function takes a single explicit key stage slug. Wrapping the
 * single slug in an array would usually produce the same result, but the
 * heuristic exists for multi-stage cases and the direct construction is
 * clearer about caller intent.
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
