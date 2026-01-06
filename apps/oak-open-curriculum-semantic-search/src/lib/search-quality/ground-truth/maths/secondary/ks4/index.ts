/**
 * KS4 Maths ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Maths with tier variant testing.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

import { MATHS_KS4_TIER_QUERIES } from './tier-variants';

/**
 * All KS4 Maths ground truth queries.
 *
 * Total: 5 queries focused on tier discrimination.
 */
export const MATHS_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_KS4_TIER_QUERIES,
] as const;

export { MATHS_KS4_TIER_QUERIES } from './tier-variants';
