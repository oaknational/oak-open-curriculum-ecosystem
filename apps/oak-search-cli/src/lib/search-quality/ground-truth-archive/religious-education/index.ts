/**
 * Religious Education ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): World religions, beliefs, practices, stories
 * - **Secondary** (KS3-4): Buddhism, Christianity, ethics, philosophy
 */

import type { GroundTruthQuery } from '../types';

import { RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES } from './primary';
import { RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Religious Education ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const RELIGIOUS_EDUCATION_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES,
  ...RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES } from './secondary';
