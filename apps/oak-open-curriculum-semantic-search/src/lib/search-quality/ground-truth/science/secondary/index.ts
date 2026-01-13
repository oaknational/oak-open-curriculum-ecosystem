/**
 * Secondary Science ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | cell structure and function | 1.000 |
 * | natural-expression | living organism processes | 1.000 |
 * | imprecise-input | resperation in humans | 1.000 |
 * | cross-topic | predator and prey ecosystem relationships | 1.000 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { SCIENCE_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { SCIENCE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { SCIENCE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { SCIENCE_SECONDARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Secondary Science ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const SCIENCE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_SECONDARY_PRECISE_TOPIC,
  ...SCIENCE_SECONDARY_NATURAL_EXPRESSION,
  ...SCIENCE_SECONDARY_IMPRECISE_INPUT,
  ...SCIENCE_SECONDARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { SCIENCE_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { SCIENCE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { SCIENCE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { SCIENCE_SECONDARY_PRECISE_TOPIC } from './precise-topic';
