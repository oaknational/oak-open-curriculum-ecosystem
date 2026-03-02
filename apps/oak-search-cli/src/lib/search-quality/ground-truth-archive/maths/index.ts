/**
 * Maths ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): 4 queries (1 per category)
 * - **Secondary** (KS3-4): 4 queries (1 per category)
 */

import type { GroundTruthQuery } from '../types';

import { MATHS_PRIMARY_ALL_QUERIES } from './primary';
import { MATHS_SECONDARY_ALL_QUERIES } from './secondary';

// Re-export all secondary maths ground truths
export { MATHS_SECONDARY_ALL_QUERIES } from './secondary';

// Re-export all primary maths ground truths
export { MATHS_PRIMARY_ALL_QUERIES } from './primary';

/**
 * All Maths ground truth queries across all phases.
 *
 * Primary: 4 queries (1 per category)
 * Secondary: 4 queries (1 per category)
 */
export const MATHS_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_PRIMARY_ALL_QUERIES,
  ...MATHS_SECONDARY_ALL_QUERIES,
] as const;
