/**
 * Maths ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Number, multiplication, fractions, geometry
 * - **Secondary** (KS3-4): Comprehensive coverage of secondary maths curriculum
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { MATHS_PRIMARY_ALL_QUERIES } from './primary';
import { MATHS_SECONDARY_ALL_QUERIES } from './secondary';

// Re-export all secondary maths ground truths
export {
  MATHS_SECONDARY_ALL_QUERIES,
  MATHS_SECONDARY_HARD_QUERIES,
  MATHS_SECONDARY_STANDARD_QUERIES,
  // Individual topic exports
  ALGEBRA_QUERIES,
  GEOMETRY_QUERIES,
  GRAPHS_QUERIES,
  NUMBER_QUERIES,
  STATISTICS_QUERIES,
  HARD_QUERIES,
  EDGE_CASE_QUERIES,
  // Unit ground truths
  UNIT_ALL_GROUND_TRUTH_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
} from './secondary';

// Re-export all primary maths ground truths
export {
  MATHS_PRIMARY_ALL_QUERIES,
  MATHS_PRIMARY_STANDARD_QUERIES,
  MATHS_PRIMARY_HARD_QUERIES,
  // Individual topic exports
  NUMBER_PRIMARY_QUERIES,
  MULTIPLICATION_PRIMARY_QUERIES,
  FRACTIONS_PRIMARY_QUERIES,
  GEOMETRY_PRIMARY_QUERIES,
} from './primary';

/**
 * All Maths ground truth queries across all phases.
 *
 * Total: 95 queries (40 Primary + 55 Secondary).
 */
export const ALL_MATHS_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_PRIMARY_ALL_QUERIES,
  ...MATHS_SECONDARY_ALL_QUERIES,
] as const;
