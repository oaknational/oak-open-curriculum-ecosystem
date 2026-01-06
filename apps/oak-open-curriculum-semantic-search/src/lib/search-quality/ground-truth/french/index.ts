/**
 * French ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS2): Vocabulary, grammar, everyday topics
 * - **Secondary** (KS3-4): Advanced grammar, literature, culture
 *
 * **IMPORTANT**: French lessons lack transcripts. Ground truths
 * test structural fields only.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { FRENCH_PRIMARY_ALL_QUERIES } from './primary';
import { FRENCH_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All French ground truth queries across all phases.
 */
export const FRENCH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_PRIMARY_ALL_QUERIES,
  ...FRENCH_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  FRENCH_PRIMARY_ALL_QUERIES,
  FRENCH_PRIMARY_HARD_QUERIES,
  FRENCH_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  FRENCH_SECONDARY_ALL_QUERIES,
  FRENCH_SECONDARY_HARD_QUERIES,
  FRENCH_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const FRENCH_STANDARD_QUERIES = FRENCH_ALL_QUERIES;
export const FRENCH_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
