/**
 * French ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  FRENCH_KS3_ALL_QUERIES,
  FRENCH_KS3_HARD_QUERIES,
  FRENCH_KS3_STANDARD_QUERIES,
} from './ks3';

export const FRENCH_STANDARD_QUERIES: readonly GroundTruthQuery[] = FRENCH_KS3_STANDARD_QUERIES;
export const FRENCH_HARD_QUERIES: readonly GroundTruthQuery[] = FRENCH_KS3_HARD_QUERIES;

/**
 * All French ground truth queries.
 *
 * Total: 6 queries (3 standard + 3 hard).
 */
export const FRENCH_ALL_QUERIES: readonly GroundTruthQuery[] = FRENCH_KS3_ALL_QUERIES;

export { FRENCH_KS3_ALL_QUERIES, FRENCH_KS3_HARD_QUERIES, FRENCH_KS3_STANDARD_QUERIES };
