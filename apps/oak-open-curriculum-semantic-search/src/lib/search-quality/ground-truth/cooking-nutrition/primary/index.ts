/**
 * Primary Cooking & Nutrition ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { COOKING_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { COOKING_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { COOKING_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { COOKING_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const COOKING_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_PRIMARY_PRECISE_TOPIC,
  ...COOKING_PRIMARY_NATURAL_EXPRESSION,
  ...COOKING_PRIMARY_IMPRECISE_INPUT,
  ...COOKING_PRIMARY_CROSS_TOPIC,
] as const;

export { COOKING_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { COOKING_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { COOKING_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { COOKING_PRIMARY_PRECISE_TOPIC } from './precise-topic';
