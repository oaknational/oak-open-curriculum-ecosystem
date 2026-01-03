/**
 * English ground truth queries for search quality evaluation.
 *
 * Comprehensive ground truth covering all key stages:
 * - KS4 (GCSE): Shakespeare, nineteenth-century, modern texts, poetry, non-fiction
 * - KS3 (Year 7-9): Fiction, Shakespeare, poetry
 * - Primary (KS1/KS2): Reading, writing
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details and keywords
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  ENGLISH_KS3_ALL_QUERIES,
  ENGLISH_KS3_HARD_QUERIES,
  ENGLISH_KS3_STANDARD_QUERIES,
} from './ks3';
import {
  ENGLISH_KS4_ALL_QUERIES,
  ENGLISH_KS4_HARD_QUERIES,
  ENGLISH_KS4_STANDARD_QUERIES,
} from './ks4';
import {
  ENGLISH_PRIMARY_ALL_QUERIES,
  ENGLISH_PRIMARY_HARD_QUERIES,
  ENGLISH_PRIMARY_STANDARD_QUERIES,
} from './primary';

/**
 * All standard English ground truth queries across all key stages.
 *
 * Total: 50 queries (27 KS4 + 13 KS3 + 10 Primary).
 */
export const ENGLISH_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_KS4_STANDARD_QUERIES,
  ...ENGLISH_KS3_STANDARD_QUERIES,
  ...ENGLISH_PRIMARY_STANDARD_QUERIES,
] as const;

/**
 * All hard English ground truth queries across all key stages.
 *
 * Total: 16 queries (8 KS4 + 4 KS3 + 4 Primary).
 */
export const ENGLISH_HARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_KS4_HARD_QUERIES,
  ...ENGLISH_KS3_HARD_QUERIES,
  ...ENGLISH_PRIMARY_HARD_QUERIES,
] as const;

/**
 * All English ground truth queries (standard + hard) across all key stages.
 *
 * Total: 66 queries.
 */
export const ENGLISH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_STANDARD_QUERIES,
  ...ENGLISH_HARD_QUERIES,
] as const;

// Re-export key stage specific queries
export {
  ENGLISH_KS3_ALL_QUERIES,
  ENGLISH_KS3_HARD_QUERIES,
  ENGLISH_KS3_STANDARD_QUERIES,
  ENGLISH_KS4_ALL_QUERIES,
  ENGLISH_KS4_HARD_QUERIES,
  ENGLISH_KS4_STANDARD_QUERIES,
  ENGLISH_PRIMARY_ALL_QUERIES,
  ENGLISH_PRIMARY_HARD_QUERIES,
  ENGLISH_PRIMARY_STANDARD_QUERIES,
};
