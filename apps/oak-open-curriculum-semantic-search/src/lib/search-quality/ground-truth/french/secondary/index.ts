/**
 * Secondary French ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { FRENCH_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { FRENCH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { FRENCH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { FRENCH_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const FRENCH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_SECONDARY_PRECISE_TOPIC,
  ...FRENCH_SECONDARY_NATURAL_EXPRESSION,
  ...FRENCH_SECONDARY_IMPRECISE_INPUT,
  ...FRENCH_SECONDARY_CROSS_TOPIC,
] as const;

export { FRENCH_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { FRENCH_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { FRENCH_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { FRENCH_SECONDARY_PRECISE_TOPIC } from './precise-topic';
