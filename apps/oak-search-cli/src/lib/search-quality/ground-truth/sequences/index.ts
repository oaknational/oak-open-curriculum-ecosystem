/**
 * Sequence ground truths index.
 *
 * Ground truths for testing sequence search quality using the `oak_sequences` index.
 *
 * Target: 1 ground truth (validates search mechanism works)
 *
 * Note: With only ~30 documents, sequences may be better served by navigation/filters
 * than search. This ground truth validates the mechanism works.
 */

import type { SequenceGroundTruth } from './types';

export type { SequenceGroundTruth } from './types';

import { MATHS_SECONDARY } from './entries/maths-secondary';

/**
 * All sequence ground truths in the system.
 *
 * Target: 1 ground truth (validates search mechanism works)
 * Note: The tiny index size (30 docs) means a single ground truth
 * is sufficient to validate the mechanism.
 */
export const SEQUENCE_GROUND_TRUTHS: readonly SequenceGroundTruth[] = [MATHS_SECONDARY] as const;
