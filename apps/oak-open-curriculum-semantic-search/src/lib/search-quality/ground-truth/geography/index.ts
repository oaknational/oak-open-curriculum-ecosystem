/**
 * Geography ground truth queries for search quality evaluation.
 *
 * Comprehensive ground truth covering:
 * - KS3 (Year 7-9): Physical geography
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  GEOGRAPHY_KS3_ALL_QUERIES,
  GEOGRAPHY_KS3_HARD_QUERIES,
  GEOGRAPHY_KS3_STANDARD_QUERIES,
} from './ks3';

/**
 * All standard Geography ground truth queries.
 */
export const GEOGRAPHY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GEOGRAPHY_KS3_STANDARD_QUERIES;

/**
 * All hard Geography ground truth queries.
 */
export const GEOGRAPHY_HARD_QUERIES: readonly GroundTruthQuery[] = GEOGRAPHY_KS3_HARD_QUERIES;

/**
 * All Geography ground truth queries.
 *
 * Total: 9 queries (5 standard + 4 hard).
 */
export const GEOGRAPHY_ALL_QUERIES: readonly GroundTruthQuery[] = GEOGRAPHY_KS3_ALL_QUERIES;

export { GEOGRAPHY_KS3_ALL_QUERIES, GEOGRAPHY_KS3_HARD_QUERIES, GEOGRAPHY_KS3_STANDARD_QUERIES };
