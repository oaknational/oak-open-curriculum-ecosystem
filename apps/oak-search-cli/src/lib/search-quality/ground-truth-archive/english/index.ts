/**
 * English ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS1-2): Reading, writing fundamentals
 * - **Secondary** (KS3-4): Fiction, Shakespeare, poetry, modern texts, non-fiction
 */

import type { GroundTruthQuery } from '../types';

import { ENGLISH_PRIMARY_ALL_QUERIES } from './primary';
import { ENGLISH_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All English ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const ENGLISH_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ENGLISH_PRIMARY_ALL_QUERIES,
  ...ENGLISH_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { ENGLISH_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { ENGLISH_SECONDARY_ALL_QUERIES } from './secondary';
