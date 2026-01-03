/**
 * KS3 French ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_KS3_FRENCH } from './grammar';
import { HARD_QUERIES_KS3_FRENCH } from './hard-queries';

export const FRENCH_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = GRAMMAR_KS3_FRENCH;
export const FRENCH_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS3_FRENCH;

export const FRENCH_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_KS3_STANDARD_QUERIES,
  ...FRENCH_KS3_HARD_QUERIES,
] as const;

export { GRAMMAR_KS3_FRENCH, HARD_QUERIES_KS3_FRENCH };
