/**
 * SECONDARY Citizenship ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { CITIZENSHIP_SECONDARY_HARD_QUERIES } from './hard-queries';
import { CITIZENSHIP_SECONDARY_STANDARD_QUERIES } from './standard';

export { CITIZENSHIP_SECONDARY_STANDARD_QUERIES, CITIZENSHIP_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Citizenship ground truth queries.
 *
 * Total: 6 queries (4 standard + 2 hard).
 */
export const CITIZENSHIP_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...CITIZENSHIP_SECONDARY_STANDARD_QUERIES,
  ...CITIZENSHIP_SECONDARY_HARD_QUERIES,
] as const;
