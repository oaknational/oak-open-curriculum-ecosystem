/**
 * SECONDARY History ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_SECONDARY_HISTORY } from './hard-queries';
import { MEDIEVAL_SECONDARY_QUERIES } from './medieval';
import { MODERN_SECONDARY_QUERIES } from './modern';

/**
 * All standard SECONDARY History ground truth queries.
 */
export const HISTORY_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...MEDIEVAL_SECONDARY_QUERIES,
  ...MODERN_SECONDARY_QUERIES,
] as const;

/**
 * Hard SECONDARY History ground truth queries.
 */
export const HISTORY_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_HISTORY;

/**
 * All SECONDARY History ground truth queries.
 */
export const HISTORY_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_SECONDARY_STANDARD_QUERIES,
  ...HISTORY_SECONDARY_HARD_QUERIES,
] as const;

export { HARD_QUERIES_SECONDARY_HISTORY, MEDIEVAL_SECONDARY_QUERIES, MODERN_SECONDARY_QUERIES };
