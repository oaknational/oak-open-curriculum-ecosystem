/**
 * KS3 History ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_KS3_HISTORY } from './hard-queries';
import { MEDIEVAL_KS3_QUERIES } from './medieval';
import { MODERN_KS3_QUERIES } from './modern';

/**
 * All standard KS3 History ground truth queries.
 */
export const HISTORY_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...MEDIEVAL_KS3_QUERIES,
  ...MODERN_KS3_QUERIES,
] as const;

/**
 * Hard KS3 History ground truth queries.
 */
export const HISTORY_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_HISTORY;

/**
 * All KS3 History ground truth queries.
 */
export const HISTORY_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_KS3_STANDARD_QUERIES,
  ...HISTORY_KS3_HARD_QUERIES,
] as const;

export { HARD_QUERIES_KS3_HISTORY, MEDIEVAL_KS3_QUERIES, MODERN_KS3_QUERIES };
