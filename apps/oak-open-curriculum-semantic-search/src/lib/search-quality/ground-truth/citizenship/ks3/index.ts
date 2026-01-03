/**
 * KS3 Citizenship ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { CITIZENSHIP_KS3_HARD_QUERIES } from './hard-queries';
import { CITIZENSHIP_KS3_STANDARD_QUERIES } from './standard';

export { CITIZENSHIP_KS3_STANDARD_QUERIES, CITIZENSHIP_KS3_HARD_QUERIES };

/**
 * All KS3 Citizenship ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const CITIZENSHIP_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...CITIZENSHIP_KS3_STANDARD_QUERIES,
  ...CITIZENSHIP_KS3_HARD_QUERIES,
] as const;
