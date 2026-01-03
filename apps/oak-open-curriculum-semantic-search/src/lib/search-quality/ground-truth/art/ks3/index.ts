/**
 * KS3 Art ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { ART_KS3_HARD_QUERIES } from './hard-queries';
import { ART_KS3_IDENTITY_QUERIES } from './identity-expression';
import { ART_KS3_MOVEMENTS_QUERIES } from './art-movements';

export const ART_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_KS3_MOVEMENTS_QUERIES,
  ...ART_KS3_IDENTITY_QUERIES,
] as const;

export { ART_KS3_HARD_QUERIES };

/**
 * All KS3 Art ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const ART_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_KS3_STANDARD_QUERIES,
  ...ART_KS3_HARD_QUERIES,
] as const;
