/**
 * Religious Education ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): World religions, beliefs, practices, stories
 * - **Secondary** (KS3-4): Philosophy, ethics, comparative religion
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { RE_PRIMARY_ALL_QUERIES } from './primary';
import { RE_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All RE ground truth queries across all phases.
 */
export const RE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_PRIMARY_ALL_QUERIES,
  ...RE_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  RE_PRIMARY_ALL_QUERIES,
  RE_PRIMARY_HARD_QUERIES,
  RE_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  RE_SECONDARY_ALL_QUERIES,
  RE_SECONDARY_HARD_QUERIES,
  RE_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const RE_STANDARD_QUERIES = RE_ALL_QUERIES;
export const RE_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
