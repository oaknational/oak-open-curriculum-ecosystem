/**
 * Citizenship ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  CITIZENSHIP_KS3_ALL_QUERIES,
  CITIZENSHIP_KS3_HARD_QUERIES,
  CITIZENSHIP_KS3_STANDARD_QUERIES,
} from './ks3';

export const CITIZENSHIP_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  CITIZENSHIP_KS3_STANDARD_QUERIES;
export const CITIZENSHIP_HARD_QUERIES: readonly GroundTruthQuery[] = CITIZENSHIP_KS3_HARD_QUERIES;

/**
 * All Citizenship ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const CITIZENSHIP_ALL_QUERIES: readonly GroundTruthQuery[] = CITIZENSHIP_KS3_ALL_QUERIES;

export {
  CITIZENSHIP_KS3_ALL_QUERIES,
  CITIZENSHIP_KS3_HARD_QUERIES,
  CITIZENSHIP_KS3_STANDARD_QUERIES,
};
