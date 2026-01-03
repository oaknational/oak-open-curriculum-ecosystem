/**
 * KS3 Science ground truth queries.
 *
 * Aggregates all KS3 Science ground truth across disciplines:
 * - Biology (cells, ecosystems, respiration)
 * - Chemistry (atoms, elements, compounds)
 * - Physics (forces, energy)
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { BIOLOGY_KS3_QUERIES } from './biology';
import { CHEMISTRY_KS3_QUERIES } from './chemistry';
import { HARD_QUERIES_KS3_SCIENCE } from './hard-queries';
import { PHYSICS_KS3_QUERIES } from './physics';

/**
 * All standard KS3 Science ground truth queries.
 *
 * Total: 15 queries across 3 disciplines.
 */
export const SCIENCE_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...BIOLOGY_KS3_QUERIES,
  ...CHEMISTRY_KS3_QUERIES,
  ...PHYSICS_KS3_QUERIES,
] as const;

/**
 * Hard KS3 Science ground truth queries.
 *
 * Total: 5 queries.
 */
export const SCIENCE_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_SCIENCE;

/**
 * All KS3 Science ground truth queries (standard + hard).
 *
 * Total: 20 queries.
 */
export const SCIENCE_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_KS3_STANDARD_QUERIES,
  ...SCIENCE_KS3_HARD_QUERIES,
] as const;

export {
  BIOLOGY_KS3_QUERIES,
  CHEMISTRY_KS3_QUERIES,
  HARD_QUERIES_KS3_SCIENCE,
  PHYSICS_KS3_QUERIES,
};
