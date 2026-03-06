/**
 * Bidirectional utilities for curriculum sequence slug derivation.
 *
 * The canonical sequence slug format expected by Oak teacher URLs is:
 * `\{subjectSlug\}-\{phaseSlug\}`
 * where `phaseSlug` is always `primary` or `secondary`.
 *
 * Forward direction: subject + phase =\> sequence slug
 *   - `normalisePhaseSlug` maps key stage tokens to canonical phase values
 *   - `deriveSequenceSlug` builds the canonical sequence slug
 *
 * Reverse direction: sequence slug =\> subject + phase
 *   - `deriveSubjectSlugFromSequence` extracts the subject portion
 *   - `derivePhaseSlugFromSequence` extracts the phase portion
 *
 * Sequence slugs may include trailing exam-board segments
 * (e.g. `science-secondary-aqa`) which the reverse functions handle correctly.
 */

const VALID_PHASES: readonly string[] = ['primary', 'secondary'];

type CanonicalPhaseSlug = 'primary' | 'secondary';

/**
 * Normalises curriculum phase tokens to canonical URL phase slugs.
 *
 * - `ks1`, `ks2` become `primary`
 * - `ks3`, `ks4` become `secondary`
 * - `primary`, `secondary` pass through unchanged
 *
 * @param phaseSlug - A phase-like string from API or internal data
 * @returns Normalised phase slug (`primary` or `secondary`)
 *
 * @throws \{TypeError\} when the phase value is not a supported phase token.
 */
export function normalisePhaseSlug(phaseSlug: string): CanonicalPhaseSlug {
  switch (phaseSlug) {
    case 'primary':
    case 'ks1':
    case 'ks2':
      return 'primary';
    case 'secondary':
    case 'ks3':
    case 'ks4':
      return 'secondary';
    default:
      throw new TypeError(`Unsupported phase slug: ${phaseSlug}`);
  }
}

/**
 * Builds a canonical sequence slug from subject + phase values.
 *
 * @param subjectSlug - Subject identifier from API payloads
 * @param phaseSlug - Phase-like string to normalise to `primary` or `secondary`
 * @returns Canonical sequence slug in `\{subjectSlug\}-\{phaseSlug\}` format
 *
 * @throws \{TypeError\} when subject or phase data is invalid.
 */
export function deriveSequenceSlug(subjectSlug: string, phaseSlug: string): string {
  const trimmedSubjectSlug = subjectSlug.trim();
  if (trimmedSubjectSlug.length === 0) {
    throw new TypeError('subjectSlug must be a non-empty string');
  }

  return `${trimmedSubjectSlug}-${normalisePhaseSlug(phaseSlug)}`;
}

// ============================================================================
// Reverse direction: sequence slug => subject + phase
// ============================================================================

/**
 * Derives the subject slug from a sequence slug.
 *
 * Sequence slugs follow the pattern `\{subjectSlug\}-\{phaseSlug\}` with optional
 * trailing exam-board segments (e.g. `\{subjectSlug\}-\{phaseSlug\}-\{examBoard\}`).
 *
 * @param sequenceSlug - The sequence slug (e.g., 'maths-primary', 'science-secondary-aqa')
 * @returns The subject slug (e.g., 'maths', 'science')
 *
 * @example
 * ```typescript
 * deriveSubjectSlugFromSequence('maths-primary');
 * // => 'maths'
 *
 * deriveSubjectSlugFromSequence('design-technology-secondary');
 * // => 'design-technology'
 *
 * deriveSubjectSlugFromSequence('science-secondary-aqa');
 * // => 'science'
 * ```
 */
export function deriveSubjectSlugFromSequence(sequenceSlug: string): string {
  const parts = sequenceSlug.split('-');
  const phaseSegmentIndex = findPhaseSegmentIndex(parts);

  if (phaseSegmentIndex > 0) {
    return parts.slice(0, phaseSegmentIndex).join('-');
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
  const phaseSegmentIndex = findPhaseSegmentIndex(parts);

  if (phaseSegmentIndex > 0) {
    return parts[phaseSegmentIndex] ?? 'unknown';
  }

  return 'unknown';
}

function findPhaseSegmentIndex(parts: readonly string[]): number {
  for (let idx = parts.length - 1; idx >= 0; idx -= 1) {
    if (isValidPhase(parts[idx])) {
      return idx;
    }
  }
  return -1;
}

function isValidPhase(value: string | undefined): value is CanonicalPhaseSlug {
  if (value === undefined) {
    return false;
  }
  return VALID_PHASES.includes(value);
}
