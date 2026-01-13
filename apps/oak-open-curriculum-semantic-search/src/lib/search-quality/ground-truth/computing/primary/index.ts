/**
 * Primary Computing ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { COMPUTING_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { COMPUTING_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { COMPUTING_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { COMPUTING_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const COMPUTING_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_PRIMARY_PRECISE_TOPIC,
  ...COMPUTING_PRIMARY_NATURAL_EXPRESSION,
  ...COMPUTING_PRIMARY_IMPRECISE_INPUT,
  ...COMPUTING_PRIMARY_CROSS_TOPIC,
] as const;

export { COMPUTING_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { COMPUTING_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { COMPUTING_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { COMPUTING_PRIMARY_PRECISE_TOPIC } from './precise-topic';
