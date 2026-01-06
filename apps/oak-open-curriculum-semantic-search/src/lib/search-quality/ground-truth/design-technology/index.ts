/**
 * Design & Technology ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Structures, mechanisms, materials, CAD
 * - **Secondary** (KS3-4): Advanced manufacturing, electronics, systems
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { DT_PRIMARY_ALL_QUERIES } from './primary';
import { DT_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All D&T ground truth queries across all phases.
 */
export const DT_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_PRIMARY_ALL_QUERIES,
  ...DT_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  DT_PRIMARY_ALL_QUERIES,
  DT_PRIMARY_HARD_QUERIES,
  DT_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  DT_SECONDARY_ALL_QUERIES,
  DT_SECONDARY_HARD_QUERIES,
  DT_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const DT_STANDARD_QUERIES = DT_ALL_QUERIES;
export const DT_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
