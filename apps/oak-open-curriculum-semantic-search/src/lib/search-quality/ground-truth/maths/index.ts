/**
 * Maths ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): 4 queries (1 per category), AI-curated
 * - **Secondary** (KS3-4): 4 queries (1 per category), AI-curated
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { MATHS_PRIMARY_ALL_QUERIES } from './primary';
import { MATHS_SECONDARY_ALL_QUERIES } from './secondary';

// Re-export all secondary maths ground truths
export {
  MATHS_SECONDARY_ALL_QUERIES,
  // Unit ground truths (preserved for backward compatibility)
  UNIT_ALL_GROUND_TRUTH_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
  // Category modules
  MATHS_SECONDARY_CROSS_TOPIC,
  MATHS_SECONDARY_IMPRECISE_INPUT,
  MATHS_SECONDARY_NATURAL_EXPRESSION,
  MATHS_SECONDARY_PRECISE_TOPIC,
} from './secondary';

// Re-export all primary maths ground truths (category-based structure)
export {
  MATHS_PRIMARY_ALL_QUERIES,
  MATHS_PRIMARY_CROSS_TOPIC,
  MATHS_PRIMARY_IMPRECISE_INPUT,
  MATHS_PRIMARY_NATURAL_EXPRESSION,
  MATHS_PRIMARY_PRECISE_TOPIC,
} from './primary';

/**
 * All Maths ground truth queries across all phases.
 *
 * Primary: 4 queries (AI-curated, 1 per category)
 * Secondary: 4 queries (AI-curated, 1 per category)
 */
export const ALL_MATHS_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_PRIMARY_ALL_QUERIES,
  ...MATHS_SECONDARY_ALL_QUERIES,
] as const;
