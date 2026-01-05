/**
 * SECONDARY French ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_SECONDARY_FRENCH } from './grammar';
import { HARD_QUERIES_SECONDARY_FRENCH } from './hard-queries';

export const FRENCH_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GRAMMAR_SECONDARY_FRENCH;
export const FRENCH_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_FRENCH;

export const FRENCH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_SECONDARY_STANDARD_QUERIES,
  ...FRENCH_SECONDARY_HARD_QUERIES,
] as const;

export { GRAMMAR_SECONDARY_FRENCH, HARD_QUERIES_SECONDARY_FRENCH };
