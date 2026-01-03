/**
 * KS3 Physical Education ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { PE_KS3_HARD_QUERIES } from './hard-queries';
import { PE_KS3_STANDARD_QUERIES } from './standard';

export { PE_KS3_STANDARD_QUERIES, PE_KS3_HARD_QUERIES };

/**
 * All KS3 Physical Education ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const PE_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_KS3_STANDARD_QUERIES,
  ...PE_KS3_HARD_QUERIES,
] as const;
