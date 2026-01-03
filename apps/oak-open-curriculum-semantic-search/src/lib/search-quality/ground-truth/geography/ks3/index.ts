/**
 * KS3 Geography ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_KS3_GEOGRAPHY } from './hard-queries';
import { PHYSICAL_KS3_QUERIES } from './physical';

/**
 * All standard KS3 Geography ground truth queries.
 */
export const GEOGRAPHY_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = PHYSICAL_KS3_QUERIES;

/**
 * Hard KS3 Geography ground truth queries.
 */
export const GEOGRAPHY_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_GEOGRAPHY;

/**
 * All KS3 Geography ground truth queries.
 */
export const GEOGRAPHY_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_KS3_STANDARD_QUERIES,
  ...GEOGRAPHY_KS3_HARD_QUERIES,
] as const;

export { HARD_QUERIES_KS3_GEOGRAPHY, PHYSICAL_KS3_QUERIES };
