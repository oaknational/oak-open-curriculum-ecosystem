/**
 * Primary Spanish ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { SPANISH_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { SPANISH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { SPANISH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { SPANISH_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const SPANISH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_PRIMARY_PRECISE_TOPIC,
  ...SPANISH_PRIMARY_NATURAL_EXPRESSION,
  ...SPANISH_PRIMARY_IMPRECISE_INPUT,
  ...SPANISH_PRIMARY_CROSS_TOPIC,
] as const;

export { SPANISH_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { SPANISH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { SPANISH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { SPANISH_PRIMARY_PRECISE_TOPIC } from './precise-topic';
