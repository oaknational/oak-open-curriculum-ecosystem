/**
 * Secondary English ground truth queries (KS3-4).
 *
 * Aggregates all Secondary English ground truth across curriculum areas:
 * - Fiction (Sherlock Holmes, Lord of the Flies, Gothic fiction)
 * - Shakespeare (The Tempest, Macbeth)
 * - Poetry (Gothic poetry, Power and Conflict anthology)
 * - Modern texts (An Inspector Calls)
 * - Nineteenth-century texts (Jekyll and Hyde, A Christmas Carol)
 * - Non-fiction and language skills
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { FICTION_SECONDARY_QUERIES } from './fiction';
import { HARD_QUERIES_SECONDARY_ENGLISH } from './hard-queries';
import { MODERN_TEXTS_SECONDARY_QUERIES } from './modern-texts';
import { NINETEENTH_CENTURY_SECONDARY_QUERIES } from './nineteenth-century';
import { NON_FICTION_SECONDARY_QUERIES } from './non-fiction';
import { POETRY_SECONDARY_QUERIES } from './poetry';
import { SHAKESPEARE_SECONDARY_QUERIES } from './shakespeare';

/**
 * All standard Secondary English ground truth queries.
 *
 * Total: 40 queries across 7 curriculum areas.
 */
export const ENGLISH_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...FICTION_SECONDARY_QUERIES,
  ...SHAKESPEARE_SECONDARY_QUERIES,
  ...POETRY_SECONDARY_QUERIES,
  ...MODERN_TEXTS_SECONDARY_QUERIES,
  ...NINETEENTH_CENTURY_SECONDARY_QUERIES,
  ...NON_FICTION_SECONDARY_QUERIES,
] as const;

/**
 * Hard Secondary English ground truth queries.
 *
 * Total: 12 queries (merged SECONDARY + KS4 hard queries).
 */
export const ENGLISH_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_ENGLISH;

/**
 * All Secondary English ground truth queries (standard + hard).
 *
 * Total: 52 queries.
 */
export const ENGLISH_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_SECONDARY_STANDARD_QUERIES,
  ...ENGLISH_SECONDARY_HARD_QUERIES,
] as const;

// Re-export individual topic arrays for granular access
export { FICTION_SECONDARY_QUERIES } from './fiction';
export { HARD_QUERIES_SECONDARY_ENGLISH } from './hard-queries';
export { MODERN_TEXTS_SECONDARY_QUERIES } from './modern-texts';
export { NINETEENTH_CENTURY_SECONDARY_QUERIES } from './nineteenth-century';
export { NON_FICTION_SECONDARY_QUERIES } from './non-fiction';
export { POETRY_SECONDARY_QUERIES } from './poetry';
export { SHAKESPEARE_SECONDARY_QUERIES } from './shakespeare';
