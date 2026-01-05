/**
 * SECONDARY German ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GRAMMAR_SECONDARY_GERMAN } from './grammar';
import { HARD_QUERIES_SECONDARY_GERMAN } from './hard-queries';

export const GERMAN_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  GRAMMAR_SECONDARY_GERMAN;
export const GERMAN_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_GERMAN;

export const GERMAN_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GERMAN_SECONDARY_STANDARD_QUERIES,
  ...GERMAN_SECONDARY_HARD_QUERIES,
] as const;

export { GRAMMAR_SECONDARY_GERMAN, HARD_QUERIES_SECONDARY_GERMAN };
