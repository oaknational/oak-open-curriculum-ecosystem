/**
 * Secondary Cooking & Nutrition ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { COOKING_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { COOKING_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { COOKING_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { COOKING_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const COOKING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_SECONDARY_PRECISE_TOPIC,
  ...COOKING_SECONDARY_NATURAL_EXPRESSION,
  ...COOKING_SECONDARY_IMPRECISE_INPUT,
  ...COOKING_SECONDARY_CROSS_TOPIC,
] as const;

export { COOKING_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { COOKING_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { COOKING_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { COOKING_SECONDARY_PRECISE_TOPIC } from './precise-topic';
