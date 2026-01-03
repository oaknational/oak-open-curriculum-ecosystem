/**
 * KS4 English ground truth queries.
 *
 * Aggregates all KS4 English ground truth across curriculum areas:
 * - Shakespeare (Macbeth, Romeo and Juliet)
 * - Nineteenth-century texts (Jekyll and Hyde, A Christmas Carol)
 * - Modern texts (An Inspector Calls, Animal Farm)
 * - Poetry (Power and Conflict anthology)
 * - Non-fiction and language skills
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_KS4_ENGLISH } from './hard-queries';
import { MODERN_TEXTS_KS4_QUERIES } from './modern-texts';
import { NINETEENTH_CENTURY_KS4_QUERIES } from './nineteenth-century';
import { NON_FICTION_KS4_QUERIES } from './non-fiction';
import { POETRY_KS4_QUERIES } from './poetry';
import { SHAKESPEARE_KS4_QUERIES } from './shakespeare';

/**
 * All standard KS4 English ground truth queries.
 *
 * Total: 27 queries across 5 curriculum areas.
 */
export const ENGLISH_KS4_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...SHAKESPEARE_KS4_QUERIES,
  ...NINETEENTH_CENTURY_KS4_QUERIES,
  ...MODERN_TEXTS_KS4_QUERIES,
  ...POETRY_KS4_QUERIES,
  ...NON_FICTION_KS4_QUERIES,
] as const;

/**
 * Hard KS4 English ground truth queries.
 *
 * Total: 8 queries covering naturalistic, misspelling, synonym, multi-concept, colloquial.
 */
export const ENGLISH_KS4_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES_KS4_ENGLISH;

/**
 * All KS4 English ground truth queries (standard + hard).
 *
 * Total: 35 queries.
 */
export const ENGLISH_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_KS4_STANDARD_QUERIES,
  ...ENGLISH_KS4_HARD_QUERIES,
] as const;

export {
  HARD_QUERIES_KS4_ENGLISH,
  MODERN_TEXTS_KS4_QUERIES,
  NINETEENTH_CENTURY_KS4_QUERIES,
  NON_FICTION_KS4_QUERIES,
  POETRY_KS4_QUERIES,
  SHAKESPEARE_KS4_QUERIES,
};
