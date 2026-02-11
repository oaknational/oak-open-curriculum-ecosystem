/**
 * Art ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Drawing, painting, sculpture, mixed media
 * - **Secondary** (KS3-4): Advanced techniques, art history, critical analysis
 */

import type { GroundTruthQuery } from '../types';

import { ART_PRIMARY_ALL_QUERIES } from './primary';
import { ART_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Art ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const ART_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_PRIMARY_ALL_QUERIES,
  ...ART_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { ART_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { ART_SECONDARY_ALL_QUERIES } from './secondary';
