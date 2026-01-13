/**
 * Primary Design & Technology ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { DT_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { DT_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { DT_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { DT_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const DT_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_PRIMARY_PRECISE_TOPIC,
  ...DT_PRIMARY_NATURAL_EXPRESSION,
  ...DT_PRIMARY_IMPRECISE_INPUT,
  ...DT_PRIMARY_CROSS_TOPIC,
] as const;

export { DT_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { DT_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { DT_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { DT_PRIMARY_PRECISE_TOPIC } from './precise-topic';
