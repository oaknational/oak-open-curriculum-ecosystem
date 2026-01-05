/**
 * PRIMARY Cooking & Nutrition ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { COOKING_PRIMARY_HARD_QUERIES } from './hard-queries';
import { COOKING_PRIMARY_STANDARD_QUERIES } from './standard';

export { COOKING_PRIMARY_STANDARD_QUERIES, COOKING_PRIMARY_HARD_QUERIES };

/**
 * All PRIMARY Cooking & Nutrition ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const COOKING_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_PRIMARY_STANDARD_QUERIES,
  ...COOKING_PRIMARY_HARD_QUERIES,
] as const;
