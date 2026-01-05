/**
 * Computing ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  COMPUTING_SECONDARY_ALL_QUERIES,
  COMPUTING_SECONDARY_HARD_QUERIES,
  COMPUTING_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const COMPUTING_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  COMPUTING_SECONDARY_STANDARD_QUERIES;
export const COMPUTING_HARD_QUERIES: readonly GroundTruthQuery[] = COMPUTING_SECONDARY_HARD_QUERIES;

/**
 * All Computing ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const COMPUTING_ALL_QUERIES: readonly GroundTruthQuery[] = COMPUTING_SECONDARY_ALL_QUERIES;

export {
  COMPUTING_SECONDARY_ALL_QUERIES,
  COMPUTING_SECONDARY_HARD_QUERIES,
  COMPUTING_SECONDARY_STANDARD_QUERIES,
};
