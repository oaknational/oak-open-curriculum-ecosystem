/**
 * Spanish ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS2): Vocabulary, grammar, everyday topics
 * - **Secondary** (KS3-4): Advanced grammar, literature, culture
 *
 * **IMPORTANT**: Spanish lessons lack transcripts. Ground truths
 * test structural fields only.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { SPANISH_PRIMARY_ALL_QUERIES } from './primary';
import { SPANISH_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Spanish ground truth queries across all phases.
 */
export const SPANISH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_PRIMARY_ALL_QUERIES,
  ...SPANISH_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  SPANISH_PRIMARY_ALL_QUERIES,
  SPANISH_PRIMARY_HARD_QUERIES,
  SPANISH_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  SPANISH_SECONDARY_ALL_QUERIES,
  SPANISH_SECONDARY_HARD_QUERIES,
  SPANISH_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const SPANISH_STANDARD_QUERIES = SPANISH_ALL_QUERIES;
export const SPANISH_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
