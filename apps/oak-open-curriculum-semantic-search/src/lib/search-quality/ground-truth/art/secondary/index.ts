/**
 * Secondary Art ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { ART_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { ART_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { ART_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { ART_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const ART_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_SECONDARY_PRECISE_TOPIC,
  ...ART_SECONDARY_NATURAL_EXPRESSION,
  ...ART_SECONDARY_IMPRECISE_INPUT,
  ...ART_SECONDARY_CROSS_TOPIC,
] as const;

export { ART_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { ART_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { ART_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { ART_SECONDARY_PRECISE_TOPIC } from './precise-topic';
