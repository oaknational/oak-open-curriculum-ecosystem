/**
 * Citizenship ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Secondary** (KS3-4): Democracy, rights, community, law, active citizenship
 *
 * Note: Citizenship is only taught at secondary level.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { CITIZENSHIP_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Citizenship ground truth queries.
 *
 * Total: 4 queries (4 Secondary).
 */
export const CITIZENSHIP_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...CITIZENSHIP_SECONDARY_ALL_QUERIES,
] as const;

// Re-export secondary
export { CITIZENSHIP_SECONDARY_ALL_QUERIES } from './secondary';
