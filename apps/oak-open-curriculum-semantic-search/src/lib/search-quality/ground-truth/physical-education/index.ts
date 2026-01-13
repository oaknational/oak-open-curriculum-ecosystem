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
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const PE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_PRIMARY_ALL_QUERIES,
  ...PE_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { PE_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { PE_SECONDARY_ALL_QUERIES } from './secondary';
