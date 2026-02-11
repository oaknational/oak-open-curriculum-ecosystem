/**
 * Slug derivation utilities for Oak curriculum data.
 *
 * This module provides functions to extract subject and phase information
 * from sequence slugs. It is the **single source of truth** for this logic,
 * used by both sequence and thread transformers.
 *
 * @remarks
 * Sequence slugs follow the pattern: `{subjectSlug}-{phaseSlug}`
 * Examples:
 * - `maths-primary` → subject: `maths`, phase: `primary`
 * - `design-technology-secondary` → subject: `design-technology`, phase: `secondary`
 *
 * @module lib/indexing/slug-derivation
 */

/**
 * Valid phase slugs that can appear as sequence suffixes.
 */
const VALID_PHASES = ['primary', 'secondary'] as const;

/**
 * Derives the subject slug from a sequence slug.
 *
 * Sequence slugs follow the pattern `{subjectSlug}-{phaseSlug}` where
 * phaseSlug is 'primary' or 'secondary'. This function strips the phase
 * suffix to extract the subject.
 *
 * @param sequenceSlug - The sequence slug (e.g., 'maths-primary')
 * @returns The subject slug (e.g., 'maths')
 *
 * @example
 * ```typescript
 * deriveSubjectSlugFromSequence('maths-primary');
 * // => 'maths'
 *
 * deriveSubjectSlugFromSequence('design-technology-secondary');
 * // => 'design-technology'
 * ```
 */
export function deriveSubjectSlugFromSequence(sequenceSlug: string): string {
  const parts = sequenceSlug.split('-');
  const lastPart = parts[parts.length - 1];

  if (isValidPhase(lastPart)) {
    return parts.slice(0, -1).join('-');
  }

  return sequenceSlug;
}

/**
 * Derives the phase slug from a sequence slug.
 *
 * @param sequenceSlug - The sequence slug (e.g., 'maths-primary')
 * @returns The phase slug ('primary', 'secondary', or 'unknown')
 *
 * @example
 * ```typescript
 * derivePhaseSlugFromSequence('maths-primary');
 * // => 'primary'
 *
 * derivePhaseSlugFromSequence('english-secondary');
 * // => 'secondary'
 *
 * derivePhaseSlugFromSequence('maths');
 * // => 'unknown'
 * ```
 */
export function derivePhaseSlugFromSequence(sequenceSlug: string): string {
  const parts = sequenceSlug.split('-');
  const lastPart = parts[parts.length - 1];

  if (isValidPhase(lastPart)) {
    return lastPart;
  }

  return 'unknown';
}

/**
 * Type guard to check if a string is a valid phase slug.
 */
function isValidPhase(value: string | undefined): value is (typeof VALID_PHASES)[number] {
  if (value === undefined) {
    return false;
  }
  for (const phase of VALID_PHASES) {
    if (phase === value) {
      return true;
    }
  }
  return false;
}
