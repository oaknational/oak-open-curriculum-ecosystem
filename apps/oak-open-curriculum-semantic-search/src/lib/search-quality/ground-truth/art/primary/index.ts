/**
 * Primary Art ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { ART_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { ART_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { ART_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { ART_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const ART_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_PRIMARY_PRECISE_TOPIC,
  ...ART_PRIMARY_NATURAL_EXPRESSION,
  ...ART_PRIMARY_IMPRECISE_INPUT,
  ...ART_PRIMARY_CROSS_TOPIC,
] as const;

export { ART_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { ART_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { ART_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { ART_PRIMARY_PRECISE_TOPIC } from './precise-topic';
