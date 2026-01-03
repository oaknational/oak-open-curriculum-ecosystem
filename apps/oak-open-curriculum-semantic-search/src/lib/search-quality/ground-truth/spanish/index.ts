/**
 * Spanish ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  SPANISH_KS3_ALL_QUERIES,
  SPANISH_KS3_HARD_QUERIES,
  SPANISH_KS3_STANDARD_QUERIES,
} from './ks3';

export const SPANISH_STANDARD_QUERIES: readonly GroundTruthQuery[] = SPANISH_KS3_STANDARD_QUERIES;
export const SPANISH_HARD_QUERIES: readonly GroundTruthQuery[] = SPANISH_KS3_HARD_QUERIES;

/**
 * All Spanish ground truth queries.
 *
 * Total: 6 queries (3 standard + 3 hard).
 */
export const SPANISH_ALL_QUERIES: readonly GroundTruthQuery[] = SPANISH_KS3_ALL_QUERIES;

export { SPANISH_KS3_ALL_QUERIES, SPANISH_KS3_HARD_QUERIES, SPANISH_KS3_STANDARD_QUERIES };
