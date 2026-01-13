/**
 * Secondary Physical Education ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { PE_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { PE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { PE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { PE_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const PE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_SECONDARY_PRECISE_TOPIC,
  ...PE_SECONDARY_NATURAL_EXPRESSION,
  ...PE_SECONDARY_IMPRECISE_INPUT,
  ...PE_SECONDARY_CROSS_TOPIC,
] as const;

export { PE_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { PE_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { PE_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { PE_SECONDARY_PRECISE_TOPIC } from './precise-topic';
