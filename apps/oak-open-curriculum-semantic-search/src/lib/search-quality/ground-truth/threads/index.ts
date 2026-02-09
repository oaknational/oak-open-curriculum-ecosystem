/**
 * Thread ground truths index.
 *
 * Ground truths for testing thread search quality using the `oak_threads` index.
 *
 * Target: 1 ground truth (Maths progression)
 *
 * ## Usage
 *
 * ```typescript
 * import { THREAD_GROUND_TRUTHS, getThreadGroundTruth } from './threads';
 *
 * // Get all thread ground truths
 * for (const gt of THREAD_GROUND_TRUTHS) {
 *   console.log(`${gt.subject}: ${gt.query}`);
 * }
 *
 * // Get specific ground truth
 * const maths = getThreadGroundTruth('maths');
 * ```
 *
 * @packageDocumentation
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';

import type { ThreadGroundTruth } from './types';

export type { ThreadGroundTruth, RelevanceScore, ExpectedRelevance } from './types';

// =============================================================================
// Ground Truth Entries
// =============================================================================

import { MATHS } from './entries/maths';

/**
 * All thread ground truths in the system.
 *
 * Target: 1 ground truth (Maths progression)
 * Note: Threads are predominantly Maths (164 documents).
 */
export const THREAD_GROUND_TRUTHS: readonly ThreadGroundTruth[] = [MATHS] as const;

// Re-export individual entries for direct access
export { MATHS } from './entries/maths';

// =============================================================================
// Accessors
// =============================================================================

/**
 * Get a thread ground truth by subject.
 *
 * @param subject - The subject slug
 * @returns The ground truth if found, undefined otherwise
 */
export function getThreadGroundTruth(subject: AllSubjectSlug): ThreadGroundTruth | undefined {
  return THREAD_GROUND_TRUTHS.find((gt) => gt.subject === subject);
}

/**
 * Get all thread ground truths for a subject.
 *
 * @param subject - The subject slug
 * @returns Array of ground truths for that subject
 */
export function getThreadGroundTruthsForSubject(
  subject: AllSubjectSlug,
): readonly ThreadGroundTruth[] {
  return THREAD_GROUND_TRUTHS.filter((gt) => gt.subject === subject);
}
