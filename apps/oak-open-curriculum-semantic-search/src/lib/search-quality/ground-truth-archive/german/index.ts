/**
 * German ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Secondary** (KS3-4): Present tense, weak verbs, cases
 *
 * Note: German is only taught at secondary level in Oak.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { GERMAN_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All German ground truth queries.
 *
 * Total: 4 queries (4 Secondary).
 */
export const GERMAN_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GERMAN_SECONDARY_ALL_QUERIES,
] as const;

// Re-export secondary
export { GERMAN_SECONDARY_ALL_QUERIES } from './secondary';
