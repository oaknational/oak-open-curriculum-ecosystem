/**
 * Secondary German ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { GERMAN_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { GERMAN_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { GERMAN_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { GERMAN_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const GERMAN_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GERMAN_SECONDARY_PRECISE_TOPIC,
  ...GERMAN_SECONDARY_NATURAL_EXPRESSION,
  ...GERMAN_SECONDARY_IMPRECISE_INPUT,
  ...GERMAN_SECONDARY_CROSS_TOPIC,
] as const;

export { GERMAN_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { GERMAN_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { GERMAN_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { GERMAN_SECONDARY_PRECISE_TOPIC } from './precise-topic';
