/**
 * SECONDARY Religious Education ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_SECONDARY_RE } from './hard-queries';
import { WORLD_RELIGIONS_SECONDARY_QUERIES } from './world-religions';

/**
 * All standard SECONDARY RE ground truth queries.
 */
export const RE_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  WORLD_RELIGIONS_SECONDARY_QUERIES;

/**
 * Hard SECONDARY RE ground truth queries.
 */
export const RE_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_SECONDARY_RE;

/**
 * All SECONDARY RE ground truth queries.
 */
export const RE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_SECONDARY_STANDARD_QUERIES,
  ...RE_SECONDARY_HARD_QUERIES,
] as const;

export { HARD_QUERIES_SECONDARY_RE, WORLD_RELIGIONS_SECONDARY_QUERIES };
