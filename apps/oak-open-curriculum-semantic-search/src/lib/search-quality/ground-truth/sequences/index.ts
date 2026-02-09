/**
 * Sequence ground truths index.
 *
 * Ground truths for testing sequence search quality using the `oak_sequences` index.
 *
 * Target: 1 ground truth (validates search mechanism works)
 *
 * Note: With only ~30 documents, sequences may be better served by navigation/filters
 * than search. This ground truth validates the mechanism works.
 *
 * ## Usage
 *
 * ```typescript
 * import { SEQUENCE_GROUND_TRUTHS, getSequenceGroundTruth } from './sequences';
 *
 * // Get all sequence ground truths
 * for (const gt of SEQUENCE_GROUND_TRUTHS) {
 *   console.log(`${gt.subject}/${gt.phase}: ${gt.query}`);
 * }
 *
 * // Get specific ground truth
 * const mathsSec = getSequenceGroundTruth('maths', 'secondary');
 * ```
 *
 * @packageDocumentation
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';

import type { Phase, SequenceGroundTruth } from './types';

export type { SequenceGroundTruth, Phase, RelevanceScore, ExpectedRelevance } from './types';

// =============================================================================
// Ground Truth Entries
// =============================================================================

import { MATHS_SECONDARY } from './entries/maths-secondary';

/**
 * All sequence ground truths in the system.
 *
 * Target: 1 ground truth (validates search mechanism works)
 * Note: The tiny index size (30 docs) means a single ground truth
 * is sufficient to validate the mechanism.
 */
export const SEQUENCE_GROUND_TRUTHS: readonly SequenceGroundTruth[] = [MATHS_SECONDARY] as const;

// Re-export individual entries for direct access
export { MATHS_SECONDARY } from './entries/maths-secondary';

// =============================================================================
// Accessors
// =============================================================================

/**
 * Get a sequence ground truth by subject and phase.
 *
 * @param subject - The subject slug
 * @param phase - The phase (primary or secondary)
 * @returns The ground truth if found, undefined otherwise
 */
export function getSequenceGroundTruth(
  subject: AllSubjectSlug,
  phase: Phase,
): SequenceGroundTruth | undefined {
  return SEQUENCE_GROUND_TRUTHS.find((gt) => gt.subject === subject && gt.phase === phase);
}

/**
 * Get all sequence ground truths for a subject.
 *
 * @param subject - The subject slug
 * @returns Array of ground truths for that subject
 */
export function getSequenceGroundTruthsForSubject(
  subject: AllSubjectSlug,
): readonly SequenceGroundTruth[] {
  return SEQUENCE_GROUND_TRUTHS.filter((gt) => gt.subject === subject);
}

/**
 * Get all sequence ground truths for a phase.
 *
 * @param phase - The phase (primary or secondary)
 * @returns Array of ground truths for that phase
 */
export function getSequenceGroundTruthsForPhase(phase: Phase): readonly SequenceGroundTruth[] {
  return SEQUENCE_GROUND_TRUTHS.filter((gt) => gt.phase === phase);
}
