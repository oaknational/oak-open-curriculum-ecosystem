/**
 * Unit ground truths index.
 *
 * Ground truths for testing unit search quality using the `oak_unit_rollup` index.
 *
 * Target: 2 ground truths (1 primary, 1 secondary)
 *
 * ## Usage
 *
 * ```typescript
 * import { UNIT_GROUND_TRUTHS, getUnitGroundTruth } from './units';
 *
 * // Get all unit ground truths
 * for (const gt of UNIT_GROUND_TRUTHS) {
 *   console.log(`${gt.subject}/${gt.phase}: ${gt.query}`);
 * }
 *
 * // Get specific ground truth
 * const mathsPrimary = getUnitGroundTruth('maths', 'primary');
 * ```
 *
 * @packageDocumentation
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';

import type { Phase, UnitGroundTruth } from './types';

export type { UnitGroundTruth, Phase, RelevanceScore, ExpectedRelevance } from './types';

// =============================================================================
// Ground Truth Entries
// =============================================================================

import { MATHS_PRIMARY } from './entries/maths-primary';
import { SCIENCE_SECONDARY } from './entries/science-secondary';

/**
 * All unit ground truths in the system.
 *
 * Target: 2 ground truths (1 primary, 1 secondary)
 */
export const UNIT_GROUND_TRUTHS: readonly UnitGroundTruth[] = [
  MATHS_PRIMARY,
  SCIENCE_SECONDARY,
] as const;

// Re-export individual entries for direct access
export { MATHS_PRIMARY } from './entries/maths-primary';
export { SCIENCE_SECONDARY } from './entries/science-secondary';

// =============================================================================
// Accessors
// =============================================================================

/**
 * Get a unit ground truth by subject and phase.
 *
 * @param subject - The subject slug
 * @param phase - The phase (primary or secondary)
 * @returns The ground truth if found, undefined otherwise
 */
export function getUnitGroundTruth(
  subject: AllSubjectSlug,
  phase: Phase,
): UnitGroundTruth | undefined {
  return UNIT_GROUND_TRUTHS.find((gt) => gt.subject === subject && gt.phase === phase);
}

/**
 * Get all unit ground truths for a subject.
 *
 * @param subject - The subject slug
 * @returns Array of ground truths for that subject (may be 0, 1, or 2)
 */
export function getUnitGroundTruthsForSubject(subject: AllSubjectSlug): readonly UnitGroundTruth[] {
  return UNIT_GROUND_TRUTHS.filter((gt) => gt.subject === subject);
}

/**
 * Get all unit ground truths for a phase.
 *
 * @param phase - The phase (primary or secondary)
 * @returns Array of ground truths for that phase
 */
export function getUnitGroundTruthsForPhase(phase: Phase): readonly UnitGroundTruth[] {
  return UNIT_GROUND_TRUTHS.filter((gt) => gt.phase === phase);
}
