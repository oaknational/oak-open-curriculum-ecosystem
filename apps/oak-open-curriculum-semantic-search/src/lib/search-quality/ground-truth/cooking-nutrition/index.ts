/**
 * Cooking & Nutrition ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  COOKING_PRIMARY_ALL_QUERIES,
  COOKING_PRIMARY_HARD_QUERIES,
  COOKING_PRIMARY_STANDARD_QUERIES,
} from './primary';

export const COOKING_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  COOKING_PRIMARY_STANDARD_QUERIES;
export const COOKING_HARD_QUERIES: readonly GroundTruthQuery[] = COOKING_PRIMARY_HARD_QUERIES;

/**
 * All Cooking & Nutrition ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const COOKING_ALL_QUERIES: readonly GroundTruthQuery[] = COOKING_PRIMARY_ALL_QUERIES;

export {
  COOKING_PRIMARY_ALL_QUERIES,
  COOKING_PRIMARY_HARD_QUERIES,
  COOKING_PRIMARY_STANDARD_QUERIES,
};
