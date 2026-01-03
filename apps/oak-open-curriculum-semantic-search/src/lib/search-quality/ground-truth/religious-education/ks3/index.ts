/**
 * KS3 Religious Education ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_KS3_RE } from './hard-queries';
import { WORLD_RELIGIONS_KS3_QUERIES } from './world-religions';

/**
 * All standard KS3 RE ground truth queries.
 */
export const RE_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = WORLD_RELIGIONS_KS3_QUERIES;

/**
 * Hard KS3 RE ground truth queries.
 */
export const RE_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_RE;

/**
 * All KS3 RE ground truth queries.
 */
export const RE_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_KS3_STANDARD_QUERIES,
  ...RE_KS3_HARD_QUERIES,
] as const;

export { HARD_QUERIES_KS3_RE, WORLD_RELIGIONS_KS3_QUERIES };
