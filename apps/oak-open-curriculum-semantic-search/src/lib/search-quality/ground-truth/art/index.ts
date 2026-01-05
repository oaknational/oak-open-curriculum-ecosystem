/**
 * Art ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  ART_SECONDARY_ALL_QUERIES,
  ART_SECONDARY_HARD_QUERIES,
  ART_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const ART_STANDARD_QUERIES: readonly GroundTruthQuery[] = ART_SECONDARY_STANDARD_QUERIES;
export const ART_HARD_QUERIES: readonly GroundTruthQuery[] = ART_SECONDARY_HARD_QUERIES;

/**
 * All Art ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const ART_ALL_QUERIES: readonly GroundTruthQuery[] = ART_SECONDARY_ALL_QUERIES;

export { ART_SECONDARY_ALL_QUERIES, ART_SECONDARY_HARD_QUERIES, ART_SECONDARY_STANDARD_QUERIES };
