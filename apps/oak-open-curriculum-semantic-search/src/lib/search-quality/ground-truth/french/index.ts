/**
 * French ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS2): Vocabulary, grammar, verbs, everyday topics
 * - **Secondary** (KS3-4): Advanced grammar, tenses, negation
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { FRENCH_PRIMARY_ALL_QUERIES } from './primary';
import { FRENCH_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All French ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const FRENCH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_PRIMARY_ALL_QUERIES,
  ...FRENCH_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { FRENCH_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { FRENCH_SECONDARY_ALL_QUERIES } from './secondary';
