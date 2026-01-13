/**
 * Primary French ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { FRENCH_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { FRENCH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { FRENCH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { FRENCH_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const FRENCH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_PRIMARY_PRECISE_TOPIC,
  ...FRENCH_PRIMARY_NATURAL_EXPRESSION,
  ...FRENCH_PRIMARY_IMPRECISE_INPUT,
  ...FRENCH_PRIMARY_CROSS_TOPIC,
] as const;

export { FRENCH_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { FRENCH_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { FRENCH_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { FRENCH_PRIMARY_PRECISE_TOPIC } from './precise-topic';
