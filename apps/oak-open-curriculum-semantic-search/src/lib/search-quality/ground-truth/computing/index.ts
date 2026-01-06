/**
 * Computing ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Digital skills, basic programming, internet safety
 * - **Secondary** (KS3-4): Advanced programming, algorithms, computer science
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { COMPUTING_PRIMARY_ALL_QUERIES } from './primary';
import { COMPUTING_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Computing ground truth queries across all phases.
 */
export const COMPUTING_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_PRIMARY_ALL_QUERIES,
  ...COMPUTING_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  COMPUTING_PRIMARY_ALL_QUERIES,
  COMPUTING_PRIMARY_HARD_QUERIES,
  COMPUTING_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  COMPUTING_SECONDARY_ALL_QUERIES,
  COMPUTING_SECONDARY_HARD_QUERIES,
  COMPUTING_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const COMPUTING_STANDARD_QUERIES = COMPUTING_ALL_QUERIES;
export const COMPUTING_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
