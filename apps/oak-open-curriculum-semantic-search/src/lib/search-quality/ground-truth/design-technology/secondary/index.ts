/**
 * Secondary Design & Technology ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { DT_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { DT_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { DT_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { DT_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const DT_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_SECONDARY_PRECISE_TOPIC,
  ...DT_SECONDARY_NATURAL_EXPRESSION,
  ...DT_SECONDARY_IMPRECISE_INPUT,
  ...DT_SECONDARY_CROSS_TOPIC,
] as const;

export { DT_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { DT_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { DT_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { DT_SECONDARY_PRECISE_TOPIC } from './precise-topic';
