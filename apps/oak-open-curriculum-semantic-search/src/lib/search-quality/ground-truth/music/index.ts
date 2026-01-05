/**
 * Music ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  MUSIC_SECONDARY_ALL_QUERIES,
  MUSIC_SECONDARY_HARD_QUERIES,
  MUSIC_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export const MUSIC_STANDARD_QUERIES: readonly GroundTruthQuery[] = MUSIC_SECONDARY_STANDARD_QUERIES;
export const MUSIC_HARD_QUERIES: readonly GroundTruthQuery[] = MUSIC_SECONDARY_HARD_QUERIES;

/**
 * All Music ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const MUSIC_ALL_QUERIES: readonly GroundTruthQuery[] = MUSIC_SECONDARY_ALL_QUERIES;

export {
  MUSIC_SECONDARY_ALL_QUERIES,
  MUSIC_SECONDARY_HARD_QUERIES,
  MUSIC_SECONDARY_STANDARD_QUERIES,
};
