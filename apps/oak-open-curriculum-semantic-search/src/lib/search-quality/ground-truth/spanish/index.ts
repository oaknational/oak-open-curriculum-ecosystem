/**
 * Spanish ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS2): Vocabulary, grammar, verbs, everyday topics
 * - **Secondary** (KS3-4): AR verbs, ser/estar, preterite tense
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { SPANISH_PRIMARY_ALL_QUERIES } from './primary';
import { SPANISH_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Spanish ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const SPANISH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_PRIMARY_ALL_QUERIES,
  ...SPANISH_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { SPANISH_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { SPANISH_SECONDARY_ALL_QUERIES } from './secondary';
