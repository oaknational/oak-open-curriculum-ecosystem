/**
 * Primary History ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | Boudica rebellion against Romans | 1.000 |
 * | natural-expression | teach year 4 about the Romans | 0.500 |
 * | imprecise-input | vikins and anglo saxons | 0.000 |
 * | cross-topic | Vikings and trade in York | 1.000 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HISTORY_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { HISTORY_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { HISTORY_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { HISTORY_PRIMARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Primary History ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const HISTORY_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_PRIMARY_PRECISE_TOPIC,
  ...HISTORY_PRIMARY_NATURAL_EXPRESSION,
  ...HISTORY_PRIMARY_IMPRECISE_INPUT,
  ...HISTORY_PRIMARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { HISTORY_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { HISTORY_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { HISTORY_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { HISTORY_PRIMARY_PRECISE_TOPIC } from './precise-topic';
