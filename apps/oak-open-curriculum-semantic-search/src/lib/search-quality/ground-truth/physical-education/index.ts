/**
 * Physical Education ground truth queries for search quality evaluation.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { PE_KS3_ALL_QUERIES, PE_KS3_HARD_QUERIES, PE_KS3_STANDARD_QUERIES } from './ks3';

export const PE_STANDARD_QUERIES: readonly GroundTruthQuery[] = PE_KS3_STANDARD_QUERIES;
export const PE_HARD_QUERIES: readonly GroundTruthQuery[] = PE_KS3_HARD_QUERIES;

/**
 * All Physical Education ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const PE_ALL_QUERIES: readonly GroundTruthQuery[] = PE_KS3_ALL_QUERIES;

export { PE_KS3_ALL_QUERIES, PE_KS3_HARD_QUERIES, PE_KS3_STANDARD_QUERIES };
