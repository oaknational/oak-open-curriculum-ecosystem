/**
 * KS3 English ground truth queries.
 *
 * Aggregates all KS3 English ground truth across curriculum areas:
 * - Fiction (Sherlock Holmes, Lord of the Flies, Gothic fiction)
 * - Shakespeare (The Tempest)
 * - Poetry (Gothic poetry)
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { FICTION_KS3_QUERIES } from './fiction';
import { HARD_QUERIES_KS3_ENGLISH } from './hard-queries';
import { POETRY_KS3_QUERIES } from './poetry';
import { SHAKESPEARE_KS3_QUERIES } from './shakespeare';

/**
 * All standard KS3 English ground truth queries.
 *
 * Total: 13 queries across 3 curriculum areas.
 */
export const ENGLISH_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...FICTION_KS3_QUERIES,
  ...SHAKESPEARE_KS3_QUERIES,
  ...POETRY_KS3_QUERIES,
] as const;

/**
 * Hard KS3 English ground truth queries.
 *
 * Total: 4 queries.
 */
export const ENGLISH_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_ENGLISH;

/**
 * All KS3 English ground truth queries (standard + hard).
 *
 * Total: 17 queries.
 */
export const ENGLISH_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_KS3_STANDARD_QUERIES,
  ...ENGLISH_KS3_HARD_QUERIES,
] as const;

export {
  FICTION_KS3_QUERIES,
  HARD_QUERIES_KS3_ENGLISH,
  POETRY_KS3_QUERIES,
  SHAKESPEARE_KS3_QUERIES,
};
