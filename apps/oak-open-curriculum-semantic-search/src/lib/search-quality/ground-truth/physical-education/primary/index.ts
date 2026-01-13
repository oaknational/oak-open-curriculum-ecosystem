/**
 * Primary Physical Education ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { PE_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { PE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { PE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { PE_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const PE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_PRIMARY_PRECISE_TOPIC,
  ...PE_PRIMARY_NATURAL_EXPRESSION,
  ...PE_PRIMARY_IMPRECISE_INPUT,
  ...PE_PRIMARY_CROSS_TOPIC,
] as const;

export { PE_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { PE_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { PE_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { PE_PRIMARY_PRECISE_TOPIC } from './precise-topic';
