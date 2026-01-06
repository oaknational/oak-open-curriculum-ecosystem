/**
 * Art ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Drawing, painting, sculpture, mixed media
 * - **Secondary** (KS3-4): Advanced techniques, art history, critical analysis
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { ART_PRIMARY_ALL_QUERIES } from './primary';
import { ART_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Art ground truth queries across all phases.
 *
 * Total: 16 queries (7 Primary + 9 Secondary).
 */
export const ART_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_PRIMARY_ALL_QUERIES,
  ...ART_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  ART_PRIMARY_ALL_QUERIES,
  ART_PRIMARY_HARD_QUERIES,
  ART_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  ART_SECONDARY_ALL_QUERIES,
  ART_SECONDARY_HARD_QUERIES,
  ART_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const ART_STANDARD_QUERIES = ART_ALL_QUERIES;
export const ART_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
