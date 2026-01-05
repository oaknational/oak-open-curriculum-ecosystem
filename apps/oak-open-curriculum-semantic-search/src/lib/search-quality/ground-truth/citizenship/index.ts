/**
 * Citizenship ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  CITIZENSHIP_SECONDARY_ALL_QUERIES,
  CITIZENSHIP_SECONDARY_HARD_QUERIES,
  CITIZENSHIP_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const CITIZENSHIP_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  CITIZENSHIP_SECONDARY_STANDARD_QUERIES;
export const CITIZENSHIP_HARD_QUERIES: readonly GroundTruthQuery[] =
  CITIZENSHIP_SECONDARY_HARD_QUERIES;

/**
 * All Citizenship ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const CITIZENSHIP_ALL_QUERIES: readonly GroundTruthQuery[] =
  CITIZENSHIP_SECONDARY_ALL_QUERIES;

export {
  CITIZENSHIP_SECONDARY_ALL_QUERIES,
  CITIZENSHIP_SECONDARY_HARD_QUERIES,
  CITIZENSHIP_SECONDARY_STANDARD_QUERIES,
};
