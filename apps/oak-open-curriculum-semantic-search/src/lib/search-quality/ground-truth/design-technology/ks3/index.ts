/**
 * KS3 Design & Technology ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { DT_KS3_HARD_QUERIES } from './hard-queries';
import { DT_KS3_STANDARD_QUERIES } from './standard';

export { DT_KS3_STANDARD_QUERIES, DT_KS3_HARD_QUERIES };

/**
 * All KS3 Design & Technology ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const DT_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_KS3_STANDARD_QUERIES,
  ...DT_KS3_HARD_QUERIES,
] as const;
