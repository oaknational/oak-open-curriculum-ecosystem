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
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const DT_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_PRIMARY_ALL_QUERIES,
  ...DT_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { DT_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { DT_SECONDARY_ALL_QUERIES } from './secondary';
