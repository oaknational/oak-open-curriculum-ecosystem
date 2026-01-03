/**
 * German ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  GERMAN_KS3_ALL_QUERIES,
  GERMAN_KS3_HARD_QUERIES,
  GERMAN_KS3_STANDARD_QUERIES,
} from './ks3';

export const GERMAN_STANDARD_QUERIES: readonly GroundTruthQuery[] = GERMAN_KS3_STANDARD_QUERIES;
export const GERMAN_HARD_QUERIES: readonly GroundTruthQuery[] = GERMAN_KS3_HARD_QUERIES;

/**
 * All German ground truth queries.
 *
 * Total: 6 queries (3 standard + 3 hard).
 */
export const GERMAN_ALL_QUERIES: readonly GroundTruthQuery[] = GERMAN_KS3_ALL_QUERIES;

export { GERMAN_KS3_ALL_QUERIES, GERMAN_KS3_HARD_QUERIES, GERMAN_KS3_STANDARD_QUERIES };
