/**
 * Secondary Citizenship ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { CITIZENSHIP_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { CITIZENSHIP_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { CITIZENSHIP_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const CITIZENSHIP_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...CITIZENSHIP_SECONDARY_PRECISE_TOPIC,
  ...CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION,
  ...CITIZENSHIP_SECONDARY_IMPRECISE_INPUT,
  ...CITIZENSHIP_SECONDARY_CROSS_TOPIC,
] as const;

export { CITIZENSHIP_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { CITIZENSHIP_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { CITIZENSHIP_SECONDARY_PRECISE_TOPIC } from './precise-topic';
