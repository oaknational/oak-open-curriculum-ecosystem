/**
 * Design & Technology ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  DT_SECONDARY_ALL_QUERIES,
  DT_SECONDARY_HARD_QUERIES,
  DT_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const DT_STANDARD_QUERIES: readonly GroundTruthQuery[] = DT_SECONDARY_STANDARD_QUERIES;
export const DT_HARD_QUERIES: readonly GroundTruthQuery[] = DT_SECONDARY_HARD_QUERIES;

/**
 * All Design & Technology ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const DT_ALL_QUERIES: readonly GroundTruthQuery[] = DT_SECONDARY_ALL_QUERIES;

export { DT_SECONDARY_ALL_QUERIES, DT_SECONDARY_HARD_QUERIES, DT_SECONDARY_STANDARD_QUERIES };
