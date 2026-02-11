/**
 * Music ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Singing, rhythm, instruments, performance
 * - **Secondary** (KS3-4): Composition, analysis, music history
 */

import type { GroundTruthQuery } from '../types';

import { MUSIC_PRIMARY_ALL_QUERIES } from './primary';
import { MUSIC_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Music ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const MUSIC_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_PRIMARY_ALL_QUERIES,
  ...MUSIC_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { MUSIC_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { MUSIC_SECONDARY_ALL_QUERIES } from './secondary';
