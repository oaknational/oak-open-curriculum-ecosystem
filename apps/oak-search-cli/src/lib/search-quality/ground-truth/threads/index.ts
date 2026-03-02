/**
 * Thread ground truths index.
 *
 * Ground truths for testing thread search quality using the `oak_threads` index.
 * Threads are conceptual progression strands that connect units across years,
 * showing how ideas build over time (programme-agnostic).
 *
 * Target: 8 ground truths across 5 subjects (Maths, Science, English, Computing, Geography)
 *
 * ## Usage
 *
 * ```typescript
 * import { THREAD_GROUND_TRUTHS, getThreadGroundTruthsForSubject } from './threads';
 *
 * // Get all thread ground truths
 * for (const gt of THREAD_GROUND_TRUTHS) {
 *   console.log(`${gt.subject}: ${gt.query}`);
 * }
 *
 * // Get all ground truths for a subject
 * const scienceGTs = getThreadGroundTruthsForSubject('science');
 * ```
 */

import type { AllSubjectSlug } from '@oaknational/curriculum-sdk';

import type { ThreadGroundTruth } from './types';

export type { ThreadGroundTruth, RelevanceScore, ExpectedRelevance } from './types';

// =============================================================================
// Ground Truth Entries
// =============================================================================

import { MATHS } from './entries/maths';
import { MATHS_FRACTIONS } from './entries/maths-fractions';
import { MATHS_GEOMETRY } from './entries/maths-geometry';
import { SCIENCE_FORCES } from './entries/science-forces';
import { SCIENCE_CHEMICAL_REACTIONS } from './entries/science-chemical-reactions';
import { ENGLISH_FICTION_WRITING } from './entries/english-fiction-writing';
import { COMPUTING_PROGRAMMING } from './entries/computing-programming';
import { GEOGRAPHY_CLIMATE } from './entries/geography-climate';

/**
 * All thread ground truths in the system.
 *
 * Target: 8 ground truths across 5 subjects (Maths, Science, English, Computing, Geography).
 * Covers 164 threads with queries designed using Known-Answer-First methodology.
 */
export const THREAD_GROUND_TRUTHS: readonly ThreadGroundTruth[] = [
  MATHS,
  MATHS_FRACTIONS,
  MATHS_GEOMETRY,
  SCIENCE_FORCES,
  SCIENCE_CHEMICAL_REACTIONS,
  ENGLISH_FICTION_WRITING,
  COMPUTING_PROGRAMMING,
  GEOGRAPHY_CLIMATE,
] as const;

// Re-export individual entries for direct access
export { MATHS } from './entries/maths';
export { MATHS_FRACTIONS } from './entries/maths-fractions';
export { MATHS_GEOMETRY } from './entries/maths-geometry';
export { SCIENCE_FORCES } from './entries/science-forces';
export { SCIENCE_CHEMICAL_REACTIONS } from './entries/science-chemical-reactions';
export { ENGLISH_FICTION_WRITING } from './entries/english-fiction-writing';
export { COMPUTING_PROGRAMMING } from './entries/computing-programming';
export { GEOGRAPHY_CLIMATE } from './entries/geography-climate';

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
