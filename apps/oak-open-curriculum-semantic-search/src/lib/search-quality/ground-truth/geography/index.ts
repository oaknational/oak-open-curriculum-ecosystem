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
  GEOGRAPHY_SECONDARY_ALL_QUERIES,
  GEOGRAPHY_SECONDARY_HARD_QUERIES,
  GEOGRAPHY_SECONDARY_STANDARD_QUERIES,
} from './secondary';

/**
 * All standard Geography ground truth queries.
 */
export const GEOGRAPHY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GEOGRAPHY_SECONDARY_STANDARD_QUERIES;

/**
 * All hard Geography ground truth queries.
 */
export const GEOGRAPHY_HARD_QUERIES: readonly GroundTruthQuery[] = GEOGRAPHY_SECONDARY_HARD_QUERIES;

/**
 * All Geography ground truth queries.
 *
 * Total: 9 queries (5 standard + 4 hard).
 */
export const GEOGRAPHY_ALL_QUERIES: readonly GroundTruthQuery[] = GEOGRAPHY_SECONDARY_ALL_QUERIES;

export {
  GEOGRAPHY_SECONDARY_ALL_QUERIES,
  GEOGRAPHY_SECONDARY_HARD_QUERIES,
  GEOGRAPHY_SECONDARY_STANDARD_QUERIES,
};
