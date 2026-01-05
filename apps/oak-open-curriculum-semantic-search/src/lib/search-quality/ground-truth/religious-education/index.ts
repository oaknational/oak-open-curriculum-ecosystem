/**
 * Religious Education ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  RE_SECONDARY_ALL_QUERIES,
  RE_SECONDARY_HARD_QUERIES,
  RE_SECONDARY_STANDARD_QUERIES,
} from './secondary';

/**
 * All standard RE ground truth queries.
 */
export const RE_STANDARD_QUERIES: readonly GroundTruthQuery[] = RE_SECONDARY_STANDARD_QUERIES;

/**
 * All hard RE ground truth queries.
 */
export const RE_HARD_QUERIES: readonly GroundTruthQuery[] = RE_SECONDARY_HARD_QUERIES;

/**
 * All RE ground truth queries.
 *
 * Total: 7 queries (4 standard + 3 hard).
 */
export const RE_ALL_QUERIES: readonly GroundTruthQuery[] = RE_SECONDARY_ALL_QUERIES;

export { RE_SECONDARY_ALL_QUERIES, RE_SECONDARY_HARD_QUERIES, RE_SECONDARY_STANDARD_QUERIES };
