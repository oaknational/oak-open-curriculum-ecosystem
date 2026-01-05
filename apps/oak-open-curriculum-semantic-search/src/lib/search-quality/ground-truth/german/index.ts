/**
 * German ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  GERMAN_SECONDARY_ALL_QUERIES,
  GERMAN_SECONDARY_HARD_QUERIES,
  GERMAN_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const GERMAN_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GERMAN_SECONDARY_STANDARD_QUERIES;
export const GERMAN_HARD_QUERIES: readonly GroundTruthQuery[] = GERMAN_SECONDARY_HARD_QUERIES;

/**
 * All German ground truth queries.
 *
 * Total: 6 queries (3 standard + 3 hard).
 */
export const GERMAN_ALL_QUERIES: readonly GroundTruthQuery[] = GERMAN_SECONDARY_ALL_QUERIES;

export {
  GERMAN_SECONDARY_ALL_QUERIES,
  GERMAN_SECONDARY_HARD_QUERIES,
  GERMAN_SECONDARY_STANDARD_QUERIES,
};
