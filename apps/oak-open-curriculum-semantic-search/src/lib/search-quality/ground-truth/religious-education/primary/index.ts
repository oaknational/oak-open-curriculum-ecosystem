/**
 * Primary Religious Education ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { RE_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { RE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { RE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { RE_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const RE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_PRIMARY_PRECISE_TOPIC,
  ...RE_PRIMARY_NATURAL_EXPRESSION,
  ...RE_PRIMARY_IMPRECISE_INPUT,
  ...RE_PRIMARY_CROSS_TOPIC,
] as const;

export { RE_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { RE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { RE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { RE_PRIMARY_PRECISE_TOPIC } from './precise-topic';
