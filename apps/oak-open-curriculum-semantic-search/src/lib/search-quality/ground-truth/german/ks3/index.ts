/**
 * KS3 German ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_KS3_GERMAN } from './grammar';
import { HARD_QUERIES_KS3_GERMAN } from './hard-queries';

export const GERMAN_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = GRAMMAR_KS3_GERMAN;
export const GERMAN_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_GERMAN;

export const GERMAN_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GERMAN_KS3_STANDARD_QUERIES,
  ...GERMAN_KS3_HARD_QUERIES,
] as const;

export { GRAMMAR_KS3_GERMAN, HARD_QUERIES_KS3_GERMAN };
