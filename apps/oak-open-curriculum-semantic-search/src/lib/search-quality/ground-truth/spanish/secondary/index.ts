/**
 * Secondary Spanish ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { SPANISH_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { SPANISH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { SPANISH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { SPANISH_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const SPANISH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_SECONDARY_PRECISE_TOPIC,
  ...SPANISH_SECONDARY_NATURAL_EXPRESSION,
  ...SPANISH_SECONDARY_IMPRECISE_INPUT,
  ...SPANISH_SECONDARY_CROSS_TOPIC,
] as const;

export { SPANISH_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { SPANISH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { SPANISH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { SPANISH_SECONDARY_PRECISE_TOPIC } from './precise-topic';
