/**
 * Religious Education ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): World religions, beliefs, practices, stories
 * - **Secondary** (KS3-4): Buddhism, Christianity, ethics, philosophy
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { RE_PRIMARY_ALL_QUERIES } from './primary';
import { RE_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Religious Education ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const RE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_PRIMARY_ALL_QUERIES,
  ...RE_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { RE_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { RE_SECONDARY_ALL_QUERIES } from './secondary';
