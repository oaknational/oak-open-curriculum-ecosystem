/**
 * Physical Education ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Locomotion, ball skills, dance, games, swimming, OAA
 * - **Secondary** (KS3-4): Advanced games, fitness, leadership
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { PE_PRIMARY_ALL_QUERIES } from './primary';
import { PE_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Physical Education ground truth queries across all phases.
 *
 * Total: 27 queries (18 Primary + 9 Secondary).
 */
export const PE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_PRIMARY_ALL_QUERIES,
  ...PE_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  PE_PRIMARY_ALL_QUERIES,
  PE_PRIMARY_HARD_QUERIES,
  PE_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  PE_SECONDARY_ALL_QUERIES,
  PE_SECONDARY_HARD_QUERIES,
  PE_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports for backwards compatibility
export const PE_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_PRIMARY_ALL_QUERIES,
  ...PE_SECONDARY_ALL_QUERIES,
] as const;
export const PE_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
