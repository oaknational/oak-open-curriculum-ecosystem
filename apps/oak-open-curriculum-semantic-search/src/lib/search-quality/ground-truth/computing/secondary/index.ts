/**
 * SECONDARY Computing ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { COMPUTING_SECONDARY_DATA_SYSTEMS_QUERIES } from './data-systems';
import { COMPUTING_SECONDARY_HARD_QUERIES } from './hard-queries';
import { COMPUTING_SECONDARY_PROGRAMMING_QUERIES } from './programming';

export const COMPUTING_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_SECONDARY_PROGRAMMING_QUERIES,
  ...COMPUTING_SECONDARY_DATA_SYSTEMS_QUERIES,
] as const;

export { COMPUTING_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Computing ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const COMPUTING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_SECONDARY_STANDARD_QUERIES,
  ...COMPUTING_SECONDARY_HARD_QUERIES,
] as const;
