/**
 * Science ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure**:
 * - **Primary** (KS1-2): Biology, Physics/Chemistry fundamentals
 * - **Secondary** (KS3-4): Biology, Chemistry, Physics
 *
 * **Note**: KS4 Science returns no units from the API currently.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { SCIENCE_SECONDARY_HARD_QUERIES, SCIENCE_SECONDARY_STANDARD_QUERIES } from './secondary';
import { SCIENCE_PRIMARY_HARD_QUERIES, SCIENCE_PRIMARY_STANDARD_QUERIES } from './primary';

/**
 * All standard Science ground truth queries across all phases.
 */
export const SCIENCE_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_SECONDARY_STANDARD_QUERIES,
  ...SCIENCE_PRIMARY_STANDARD_QUERIES,
] as const;

/**
 * All hard Science ground truth queries across all phases.
 */
export const SCIENCE_HARD_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_SECONDARY_HARD_QUERIES,
  ...SCIENCE_PRIMARY_HARD_QUERIES,
] as const;

/**
 * All Science ground truth queries (standard + hard) across all phases.
 */
export const SCIENCE_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SCIENCE_STANDARD_QUERIES,
  ...SCIENCE_HARD_QUERIES,
] as const;

// Phase-based exports
export {
  SCIENCE_SECONDARY_ALL_QUERIES,
  SCIENCE_SECONDARY_HARD_QUERIES,
  SCIENCE_SECONDARY_STANDARD_QUERIES,
} from './secondary';

export {
  SCIENCE_PRIMARY_ALL_QUERIES,
  SCIENCE_PRIMARY_HARD_QUERIES,
  SCIENCE_PRIMARY_STANDARD_QUERIES,
} from './primary';
