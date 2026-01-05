/**
 * Maths ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Placeholder for primary maths ground truths (Phase 5b)
 * - **Secondary** (KS3-4): Comprehensive coverage of secondary maths curriculum
 *
 * @packageDocumentation
 */

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

import type { GroundTruthQuery } from '../types';
import { MATHS_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Maths ground truth queries across all phases.
 *
 * Currently includes:
 * - Secondary (KS3-4): 55 queries
 *
 * Primary (KS1-2) will be added in Phase 5b.
 */
export const ALL_MATHS_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_SECONDARY_ALL_QUERIES,
  // Primary queries will be added here in Phase 5b
] as const;
