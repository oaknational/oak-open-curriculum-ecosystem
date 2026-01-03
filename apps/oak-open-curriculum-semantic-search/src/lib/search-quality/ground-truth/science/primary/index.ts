/**
 * Primary Science ground truth queries.
 *
 * Aggregates all Primary Science ground truth across disciplines:
 * - Biology (evolution, adaptation, human body)
 * - Physics/Chemistry (forces, materials)
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { BIOLOGY_PRIMARY_QUERIES } from './biology';
import { HARD_QUERIES_PRIMARY_SCIENCE } from './hard-queries';
import { PHYSICS_CHEMISTRY_PRIMARY_QUERIES } from './physics-chemistry';

/**
 * All standard Primary Science ground truth queries.
 *
 * Total: 11 queries across 2 discipline areas.
 */
export const SCIENCE_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...BIOLOGY_PRIMARY_QUERIES,
  ...PHYSICS_CHEMISTRY_PRIMARY_QUERIES,
] as const;

/**
 * Hard Primary Science ground truth queries.
 *
 * Total: 4 queries.
 */
export const SCIENCE_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_PRIMARY_SCIENCE;

/**
 * All Primary Science ground truth queries (standard + hard).
 *
 * Total: 15 queries.
 */
export const SCIENCE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_PRIMARY_STANDARD_QUERIES,
  ...SCIENCE_PRIMARY_HARD_QUERIES,
] as const;

export { BIOLOGY_PRIMARY_QUERIES, HARD_QUERIES_PRIMARY_SCIENCE, PHYSICS_CHEMISTRY_PRIMARY_QUERIES };
