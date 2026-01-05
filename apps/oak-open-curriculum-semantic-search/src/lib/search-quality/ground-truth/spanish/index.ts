/**
 * Spanish ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  SPANISH_SECONDARY_ALL_QUERIES,
  SPANISH_SECONDARY_HARD_QUERIES,
  SPANISH_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const SPANISH_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  SPANISH_SECONDARY_STANDARD_QUERIES;
export const SPANISH_HARD_QUERIES: readonly GroundTruthQuery[] = SPANISH_SECONDARY_HARD_QUERIES;

/**
 * All Spanish ground truth queries.
 *
 * Total: 6 queries (3 standard + 3 hard).
 */
export const SPANISH_ALL_QUERIES: readonly GroundTruthQuery[] = SPANISH_SECONDARY_ALL_QUERIES;

export {
  SPANISH_SECONDARY_ALL_QUERIES,
  SPANISH_SECONDARY_HARD_QUERIES,
  SPANISH_SECONDARY_STANDARD_QUERIES,
};
