/**
 * KS3 Spanish ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_KS3_SPANISH } from './grammar';
import { HARD_QUERIES_KS3_SPANISH } from './hard-queries';

export const SPANISH_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = GRAMMAR_KS3_SPANISH;
export const SPANISH_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_SPANISH;

export const SPANISH_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_KS3_STANDARD_QUERIES,
  ...SPANISH_KS3_HARD_QUERIES,
] as const;

export { GRAMMAR_KS3_SPANISH, HARD_QUERIES_KS3_SPANISH };
