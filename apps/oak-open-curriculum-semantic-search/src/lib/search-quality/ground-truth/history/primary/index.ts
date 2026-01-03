/**
 * Primary History ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { ANCIENT_PRIMARY_QUERIES } from './ancient';
import { HARD_QUERIES_PRIMARY_HISTORY } from './hard-queries';

/**
 * All standard Primary History ground truth queries.
 */
export const HISTORY_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  ANCIENT_PRIMARY_QUERIES;

/**
 * Hard Primary History ground truth queries.
 */
export const HISTORY_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_PRIMARY_HISTORY;

/**
 * All Primary History ground truth queries.
 */
export const HISTORY_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_PRIMARY_STANDARD_QUERIES,
  ...HISTORY_PRIMARY_HARD_QUERIES,
] as const;

export { ANCIENT_PRIMARY_QUERIES, HARD_QUERIES_PRIMARY_HISTORY };
