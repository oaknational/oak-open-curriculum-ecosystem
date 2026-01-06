/**
 * KS4 English ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE English Literature set texts.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

import { ENGLISH_KS4_SET_TEXT_QUERIES } from './set-texts';

/**
 * All KS4 English ground truth queries.
 *
 * Total: 5 queries focused on set texts.
 */
export const ENGLISH_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_KS4_SET_TEXT_QUERIES,
] as const;

export { ENGLISH_KS4_SET_TEXT_QUERIES } from './set-texts';
