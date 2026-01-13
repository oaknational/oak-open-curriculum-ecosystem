/**
 * Secondary Computing ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { COMPUTING_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { COMPUTING_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { COMPUTING_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { COMPUTING_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const COMPUTING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_SECONDARY_PRECISE_TOPIC,
  ...COMPUTING_SECONDARY_NATURAL_EXPRESSION,
  ...COMPUTING_SECONDARY_IMPRECISE_INPUT,
  ...COMPUTING_SECONDARY_CROSS_TOPIC,
] as const;

export { COMPUTING_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { COMPUTING_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { COMPUTING_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { COMPUTING_SECONDARY_PRECISE_TOPIC } from './precise-topic';
