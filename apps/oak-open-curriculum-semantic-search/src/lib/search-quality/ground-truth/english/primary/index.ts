/**
 * Primary English ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**:
 * 4 queries total, 1 per category, AI-curated for accuracy.
 *
 * | Category | Query | MRR |
 * |----------|-------|-----|
 * | precise-topic | The BFG reading comprehension Roald Dahl Year 3 | 1.000 |
 * | natural-expression | that Roald Dahl book with the giant BFG reading | 1.000 |
 * | imprecise-input | narative writing storys iron man Year 3 | 0.167 |
 * | cross-topic | writing and grammar tenses together | 1.000 |
 *
 * **Measurement Scope**: These queries test expected slug position,
 * NOT user satisfaction. See audit report for details.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { ENGLISH_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { ENGLISH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { ENGLISH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { ENGLISH_PRIMARY_PRECISE_TOPIC } from './precise-topic';

/**
 * All Primary English ground truth queries.
 *
 * Total: 4 queries (1 per category).
 */
export const ENGLISH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_PRIMARY_PRECISE_TOPIC,
  ...ENGLISH_PRIMARY_NATURAL_EXPRESSION,
  ...ENGLISH_PRIMARY_IMPRECISE_INPUT,
  ...ENGLISH_PRIMARY_CROSS_TOPIC,
] as const;

// Re-export category modules
export { ENGLISH_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { ENGLISH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { ENGLISH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { ENGLISH_PRIMARY_PRECISE_TOPIC } from './precise-topic';
