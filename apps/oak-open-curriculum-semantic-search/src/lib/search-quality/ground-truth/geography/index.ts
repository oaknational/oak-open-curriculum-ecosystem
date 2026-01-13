/**
 * Geography ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS1-2): Local area, UK, mapping, environment
 * - **Secondary** (KS3-4): Physical/human geography, fieldwork
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { GEOGRAPHY_PRIMARY_ALL_QUERIES } from './primary';
import { GEOGRAPHY_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Geography ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const GEOGRAPHY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_PRIMARY_ALL_QUERIES,
  ...GEOGRAPHY_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { GEOGRAPHY_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { GEOGRAPHY_SECONDARY_ALL_QUERIES } from './secondary';
