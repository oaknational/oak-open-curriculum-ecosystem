/**
 * Primary Science ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | evolution Darwin finches Year 6 | 1.000 |
 * | natural-expression | that Darwin bird lesson | 1.000 |
 * | imprecise-input | evoloution and adaptashun | 0.333 |
 * | cross-topic | animals and food together | 0.250 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { SCIENCE_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { SCIENCE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { SCIENCE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { SCIENCE_PRIMARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Primary Science ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const SCIENCE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_PRIMARY_PRECISE_TOPIC,
  ...SCIENCE_PRIMARY_NATURAL_EXPRESSION,
  ...SCIENCE_PRIMARY_IMPRECISE_INPUT,
  ...SCIENCE_PRIMARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { SCIENCE_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { SCIENCE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { SCIENCE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { SCIENCE_PRIMARY_PRECISE_TOPIC } from './precise-topic';
