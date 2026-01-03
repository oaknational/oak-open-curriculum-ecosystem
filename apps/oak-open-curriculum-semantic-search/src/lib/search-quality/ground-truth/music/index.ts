/**
 * Music ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { MUSIC_KS3_ALL_QUERIES, MUSIC_KS3_HARD_QUERIES, MUSIC_KS3_STANDARD_QUERIES } from './ks3';

export const MUSIC_STANDARD_QUERIES: readonly GroundTruthQuery[] = MUSIC_KS3_STANDARD_QUERIES;
export const MUSIC_HARD_QUERIES: readonly GroundTruthQuery[] = MUSIC_KS3_HARD_QUERIES;

/**
 * All Music ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const MUSIC_ALL_QUERIES: readonly GroundTruthQuery[] = MUSIC_KS3_ALL_QUERIES;

export { MUSIC_KS3_ALL_QUERIES, MUSIC_KS3_HARD_QUERIES, MUSIC_KS3_STANDARD_QUERIES };
