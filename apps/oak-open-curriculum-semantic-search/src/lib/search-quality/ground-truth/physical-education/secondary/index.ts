/**
 * SECONDARY Physical Education ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { PE_SECONDARY_HARD_QUERIES } from './hard-queries';
import { PE_SECONDARY_STANDARD_QUERIES } from './standard';

export { PE_SECONDARY_STANDARD_QUERIES, PE_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Physical Education ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const PE_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_SECONDARY_STANDARD_QUERIES,
  ...PE_SECONDARY_HARD_QUERIES,
] as const;
