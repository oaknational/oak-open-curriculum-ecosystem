/**
 * Secondary Religious Education ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { RE_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { RE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { RE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { RE_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const RE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_SECONDARY_PRECISE_TOPIC,
  ...RE_SECONDARY_NATURAL_EXPRESSION,
  ...RE_SECONDARY_IMPRECISE_INPUT,
  ...RE_SECONDARY_CROSS_TOPIC,
] as const;

export { RE_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { RE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { RE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { RE_SECONDARY_PRECISE_TOPIC } from './precise-topic';
