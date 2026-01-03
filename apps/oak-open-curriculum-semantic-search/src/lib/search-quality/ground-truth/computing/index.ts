/**
 * Computing ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  COMPUTING_KS3_ALL_QUERIES,
  COMPUTING_KS3_HARD_QUERIES,
  COMPUTING_KS3_STANDARD_QUERIES,
} from './ks3';

export const COMPUTING_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  COMPUTING_KS3_STANDARD_QUERIES;
export const COMPUTING_HARD_QUERIES: readonly GroundTruthQuery[] = COMPUTING_KS3_HARD_QUERIES;

/**
 * All Computing ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const COMPUTING_ALL_QUERIES: readonly GroundTruthQuery[] = COMPUTING_KS3_ALL_QUERIES;

export { COMPUTING_KS3_ALL_QUERIES, COMPUTING_KS3_HARD_QUERIES, COMPUTING_KS3_STANDARD_QUERIES };
