/**
 * Physical Education ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Locomotion, ball skills, dance, games, swimming, OAA
 * - **Secondary** (KS3-4): Advanced games, fitness, leadership
 */

import type { GroundTruthQuery } from '../types';

import { PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES } from './primary';
import { PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Physical Education ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const PHYSICAL_EDUCATION_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES,
  ...PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES } from './secondary';
