/**
 * Primary (KS1/KS2) English ground truth queries.
 *
 * Aggregates all Primary English ground truth across curriculum areas:
 * - Reading (traditional tales, narrative texts, book clubs)
 * - Writing (narrative, diary, non-fiction)
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_PRIMARY_ENGLISH } from './hard-queries';
import { READING_PRIMARY_QUERIES } from './reading';
import { WRITING_PRIMARY_QUERIES } from './writing';

/**
 * All standard Primary English ground truth queries.
 *
 * Total: 10 queries across 2 curriculum areas.
 */
export const ENGLISH_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...READING_PRIMARY_QUERIES,
  ...WRITING_PRIMARY_QUERIES,
] as const;

/**
 * Hard Primary English ground truth queries.
 *
 * Total: 4 queries.
 */
export const ENGLISH_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_PRIMARY_ENGLISH;

/**
 * All Primary English ground truth queries (standard + hard).
 *
 * Total: 14 queries.
 */
export const ENGLISH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_PRIMARY_STANDARD_QUERIES,
  ...ENGLISH_PRIMARY_HARD_QUERIES,
] as const;

export { HARD_QUERIES_PRIMARY_ENGLISH, READING_PRIMARY_QUERIES, WRITING_PRIMARY_QUERIES };
