/**
 * KS2 Cooking & Nutrition ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { COOKING_KS2_HARD_QUERIES } from './hard-queries';
import { COOKING_KS2_STANDARD_QUERIES } from './standard';

export { COOKING_KS2_STANDARD_QUERIES, COOKING_KS2_HARD_QUERIES };

/**
 * All KS2 Cooking & Nutrition ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const COOKING_KS2_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_KS2_STANDARD_QUERIES,
  ...COOKING_KS2_HARD_QUERIES,
] as const;
