/**
 * History ground truth queries for search quality evaluation.
 *
 * Comprehensive ground truth covering:
 * - KS3 (Year 7-9): Medieval, Modern history
 * - Primary (KS2): Ancient history
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  HISTORY_SECONDARY_ALL_QUERIES,
  HISTORY_SECONDARY_HARD_QUERIES,
  HISTORY_SECONDARY_STANDARD_QUERIES,
} from './secondary';
import {
  HISTORY_PRIMARY_ALL_QUERIES,
  HISTORY_PRIMARY_HARD_QUERIES,
  HISTORY_PRIMARY_STANDARD_QUERIES,
} from './primary';

/**
 * All standard History ground truth queries.
 */
export const HISTORY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_SECONDARY_STANDARD_QUERIES,
  ...HISTORY_PRIMARY_STANDARD_QUERIES,
] as const;

/**
 * All hard History ground truth queries.
 */
export const HISTORY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_SECONDARY_HARD_QUERIES,
  ...HISTORY_PRIMARY_HARD_QUERIES,
] as const;

/**
 * All History ground truth queries.
 *
 * Total: 16 queries (11 standard + 5 hard).
 */
export const HISTORY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_STANDARD_QUERIES,
  ...HISTORY_HARD_QUERIES,
] as const;

export {
  HISTORY_SECONDARY_ALL_QUERIES,
  HISTORY_SECONDARY_HARD_QUERIES,
  HISTORY_SECONDARY_STANDARD_QUERIES,
  HISTORY_PRIMARY_ALL_QUERIES,
  HISTORY_PRIMARY_HARD_QUERIES,
  HISTORY_PRIMARY_STANDARD_QUERIES,
};
