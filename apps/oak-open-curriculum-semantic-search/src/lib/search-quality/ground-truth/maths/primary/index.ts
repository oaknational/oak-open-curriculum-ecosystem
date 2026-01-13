/**
 * Primary Maths ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | place value tens and ones | 1.000 |
 * | natural-expression | takeaway sums primary | 0.200 |
 * | imprecise-input | halfs and quarters | 0.500 |
 * | cross-topic | pattern blocks tangrams | 1.000 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { MATHS_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { MATHS_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { MATHS_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { MATHS_PRIMARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Primary Maths ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const MATHS_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_PRIMARY_PRECISE_TOPIC,
  ...MATHS_PRIMARY_NATURAL_EXPRESSION,
  ...MATHS_PRIMARY_IMPRECISE_INPUT,
  ...MATHS_PRIMARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { MATHS_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { MATHS_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { MATHS_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { MATHS_PRIMARY_PRECISE_TOPIC } from './precise-topic';
