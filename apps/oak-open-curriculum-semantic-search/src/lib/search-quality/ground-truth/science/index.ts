/**
 * Science ground truth queries for search quality evaluation.
 *
 * Comprehensive ground truth covering:
 * - KS3 (Year 7-9): Biology, Chemistry, Physics
 * - Primary (KS1/KS2): Biology, Physics/Chemistry
 *
 * **Note**: KS4 Science returns no units from the API currently.
 * Ground truths for KS4 will be added when content becomes available.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import {
  SCIENCE_KS3_ALL_QUERIES,
  SCIENCE_KS3_HARD_QUERIES,
  SCIENCE_KS3_STANDARD_QUERIES,
} from './ks3';
import {
  SCIENCE_PRIMARY_ALL_QUERIES,
  SCIENCE_PRIMARY_HARD_QUERIES,
  SCIENCE_PRIMARY_STANDARD_QUERIES,
} from './primary';

/**
 * All standard Science ground truth queries across all key stages.
 *
 * Total: 26 queries (15 KS3 + 11 Primary).
 */
export const SCIENCE_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_KS3_STANDARD_QUERIES,
  ...SCIENCE_PRIMARY_STANDARD_QUERIES,
] as const;

/**
 * All hard Science ground truth queries across all key stages.
 *
 * Total: 9 queries (5 KS3 + 4 Primary).
 */
export const SCIENCE_HARD_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_KS3_HARD_QUERIES,
  ...SCIENCE_PRIMARY_HARD_QUERIES,
] as const;

/**
 * All Science ground truth queries (standard + hard) across all key stages.
 *
 * Total: 35 queries.
 */
export const SCIENCE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_STANDARD_QUERIES,
  ...SCIENCE_HARD_QUERIES,
] as const;

// Re-export key stage specific queries
export {
  SCIENCE_KS3_ALL_QUERIES,
  SCIENCE_KS3_HARD_QUERIES,
  SCIENCE_KS3_STANDARD_QUERIES,
  SCIENCE_PRIMARY_ALL_QUERIES,
  SCIENCE_PRIMARY_HARD_QUERIES,
  SCIENCE_PRIMARY_STANDARD_QUERIES,
};
