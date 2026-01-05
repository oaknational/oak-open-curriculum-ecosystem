/**
 * SECONDARY Design & Technology ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { DT_SECONDARY_HARD_QUERIES } from './hard-queries';
import { DT_SECONDARY_STANDARD_QUERIES } from './standard';

export { DT_SECONDARY_STANDARD_QUERIES, DT_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Design & Technology ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const DT_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_SECONDARY_STANDARD_QUERIES,
  ...DT_SECONDARY_HARD_QUERIES,
] as const;
