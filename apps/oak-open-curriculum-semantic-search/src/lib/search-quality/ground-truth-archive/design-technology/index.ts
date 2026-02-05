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

import { DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES } from './primary';
import { DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All D&T ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const DESIGN_TECHNOLOGY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES,
  ...DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES } from './secondary';
