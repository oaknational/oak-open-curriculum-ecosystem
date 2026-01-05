/**
 * English ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS1-2): Reading, writing fundamentals
 * - **Secondary** (KS3-4): Fiction, Shakespeare, poetry, modern texts, non-fiction
 *
 * **Query types** (2026-01-03):
 * - Curriculum concept queries: Test semantic understanding (e.g., "persuasive writing")
 * - Content discovery queries: Test specific content findability (e.g., "Macbeth guilt")
 *
 * **Methodology**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { ENGLISH_PRIMARY_HARD_QUERIES, ENGLISH_PRIMARY_STANDARD_QUERIES } from './primary';
import { ENGLISH_SECONDARY_HARD_QUERIES, ENGLISH_SECONDARY_STANDARD_QUERIES } from './secondary';

/**
 * All standard English ground truth queries across all phases.
 *
 * Total: 50 queries (40 Secondary + 10 Primary).
 */
export const ENGLISH_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_SECONDARY_STANDARD_QUERIES,
  ...ENGLISH_PRIMARY_STANDARD_QUERIES,
] as const;

/**
 * All hard English ground truth queries across all phases.
 *
 * Total: 16 queries (12 Secondary + 4 Primary).
 */
export const ENGLISH_HARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_SECONDARY_HARD_QUERIES,
  ...ENGLISH_PRIMARY_HARD_QUERIES,
] as const;

/**
 * All English ground truth queries (standard + hard) across all phases.
 *
 * Total: 66 queries.
 */
export const ENGLISH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_STANDARD_QUERIES,
  ...ENGLISH_HARD_QUERIES,
] as const;

// Phase-based exports
export {
  ENGLISH_PRIMARY_ALL_QUERIES,
  ENGLISH_PRIMARY_HARD_QUERIES,
  ENGLISH_PRIMARY_STANDARD_QUERIES,
} from './primary';

export {
  ENGLISH_SECONDARY_ALL_QUERIES,
  ENGLISH_SECONDARY_HARD_QUERIES,
  ENGLISH_SECONDARY_STANDARD_QUERIES,
  FICTION_SECONDARY_QUERIES,
  HARD_QUERIES_SECONDARY_ENGLISH,
  MODERN_TEXTS_SECONDARY_QUERIES,
  NINETEENTH_CENTURY_SECONDARY_QUERIES,
  NON_FICTION_SECONDARY_QUERIES,
  POETRY_SECONDARY_QUERIES,
  SHAKESPEARE_SECONDARY_QUERIES,
} from './secondary';
