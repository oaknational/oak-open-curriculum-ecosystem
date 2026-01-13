/**
 * Secondary English ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | Lord of the Flies symbolism | 1.000 |
 * | natural-expression | teach students about gothic literature year 8 | 1.000 |
 * | imprecise-input | frankenstien monster creation | 0.500 |
 * | cross-topic | grammar and punctuation in essay writing | 0.100 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { ENGLISH_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { ENGLISH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { ENGLISH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { ENGLISH_SECONDARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Secondary English ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const ENGLISH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_SECONDARY_PRECISE_TOPIC,
  ...ENGLISH_SECONDARY_NATURAL_EXPRESSION,
  ...ENGLISH_SECONDARY_IMPRECISE_INPUT,
  ...ENGLISH_SECONDARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { ENGLISH_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { ENGLISH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { ENGLISH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { ENGLISH_SECONDARY_PRECISE_TOPIC } from './precise-topic';
