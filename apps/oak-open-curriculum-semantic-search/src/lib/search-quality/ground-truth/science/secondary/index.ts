/**
 * Secondary Science ground truth queries (KS3-4).
 *
 * Aggregates all Secondary Science ground truth across disciplines:
 * - Biology (cells, ecosystems, respiration)
 * - Chemistry (atoms, elements, compounds)
 * - Physics (forces, energy)
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { BIOLOGY_SECONDARY_QUERIES } from './biology';
import { CHEMISTRY_SECONDARY_QUERIES } from './chemistry';
import { HARD_QUERIES_SECONDARY_SCIENCE } from './hard-queries';
import { PHYSICS_SECONDARY_QUERIES } from './physics';

/**
 * All standard Secondary Science ground truth queries.
 */
export const SCIENCE_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...BIOLOGY_SECONDARY_QUERIES,
  ...CHEMISTRY_SECONDARY_QUERIES,
  ...PHYSICS_SECONDARY_QUERIES,
] as const;

/**
 * Hard Secondary Science ground truth queries.
 */
export const SCIENCE_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_SCIENCE;

/**
 * All Secondary Science ground truth queries (standard + hard).
 */
export const SCIENCE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_SECONDARY_STANDARD_QUERIES,
  ...SCIENCE_SECONDARY_HARD_QUERIES,
] as const;

export {
  BIOLOGY_SECONDARY_QUERIES,
  CHEMISTRY_SECONDARY_QUERIES,
  HARD_QUERIES_SECONDARY_SCIENCE,
  PHYSICS_SECONDARY_QUERIES,
};
