/**
 * History ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS2): Ancient history, Romans, Vikings
 * - **Secondary** (KS3-4): Medieval, Modern history, Holocaust
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { HISTORY_PRIMARY_ALL_QUERIES } from './primary';
import { HISTORY_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All History ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const HISTORY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_PRIMARY_ALL_QUERIES,
  ...HISTORY_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { HISTORY_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { HISTORY_SECONDARY_ALL_QUERIES } from './secondary';
