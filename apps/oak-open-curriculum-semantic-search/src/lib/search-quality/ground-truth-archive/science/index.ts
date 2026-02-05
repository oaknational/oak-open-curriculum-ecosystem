/**
 * Science ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS1-2): Biology, Physics/Chemistry fundamentals
 * - **Secondary** (KS3-4): Biology, Chemistry, Physics
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { SCIENCE_PRIMARY_ALL_QUERIES } from './primary';
import { SCIENCE_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Science ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const SCIENCE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_PRIMARY_ALL_QUERIES,
  ...SCIENCE_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { SCIENCE_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { SCIENCE_SECONDARY_ALL_QUERIES } from './secondary';
