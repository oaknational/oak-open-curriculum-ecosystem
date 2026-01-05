/**
 * SECONDARY Spanish ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_SECONDARY_SPANISH } from './grammar';
import { HARD_QUERIES_SECONDARY_SPANISH } from './hard-queries';

export const SPANISH_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GRAMMAR_SECONDARY_SPANISH;
export const SPANISH_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_SPANISH;

export const SPANISH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_SECONDARY_STANDARD_QUERIES,
  ...SPANISH_SECONDARY_HARD_QUERIES,
] as const;

export { GRAMMAR_SECONDARY_SPANISH, HARD_QUERIES_SECONDARY_SPANISH };
