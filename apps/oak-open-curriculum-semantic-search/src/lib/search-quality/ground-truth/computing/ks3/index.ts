/**
 * KS3 Computing ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { COMPUTING_KS3_DATA_SYSTEMS_QUERIES } from './data-systems';
import { COMPUTING_KS3_HARD_QUERIES } from './hard-queries';
import { COMPUTING_KS3_PROGRAMMING_QUERIES } from './programming';

export const COMPUTING_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_KS3_PROGRAMMING_QUERIES,
  ...COMPUTING_KS3_DATA_SYSTEMS_QUERIES,
] as const;

export { COMPUTING_KS3_HARD_QUERIES };

/**
 * All KS3 Computing ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const COMPUTING_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_KS3_STANDARD_QUERIES,
  ...COMPUTING_KS3_HARD_QUERIES,
] as const;
