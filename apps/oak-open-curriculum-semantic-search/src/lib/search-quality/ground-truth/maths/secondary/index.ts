/**
 * Secondary Maths ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | solving quadratic equations by factorising | 1.000 |
 * | natural-expression | the bit where you complete the square | 1.000 |
 * | imprecise-input | simulatneous equasions substitution method | 1.000 |
 * | cross-topic | combining algebra with graphs | 0.333 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { MATHS_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { MATHS_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { MATHS_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { MATHS_SECONDARY_PRECISE_TOPIC } from './precise-topic';

// Re-export unit ground truths (preserved for backward compatibility)
export {
  UNIT_ALL_GROUND_TRUTH_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
} from './units';

/**
 * All Secondary Maths ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const MATHS_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_SECONDARY_PRECISE_TOPIC,
  ...MATHS_SECONDARY_NATURAL_EXPRESSION,
  ...MATHS_SECONDARY_IMPRECISE_INPUT,
  ...MATHS_SECONDARY_CROSS_TOPIC,
] as const;

// Legacy exports - empty arrays for backward compatibility during transition
export const MATHS_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const MATHS_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const ALGEBRA_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const GEOMETRY_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const GRAPHS_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const NUMBER_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const STATISTICS_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
export const EDGE_CASE_QUERIES: readonly GroundTruthQuery[] = [] as const;

// Re-export category modules
export { MATHS_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { MATHS_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { MATHS_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { MATHS_SECONDARY_PRECISE_TOPIC } from './precise-topic';
