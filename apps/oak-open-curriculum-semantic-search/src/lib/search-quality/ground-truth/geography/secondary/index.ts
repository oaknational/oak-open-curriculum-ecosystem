/**
 * SECONDARY Geography ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HARD_QUERIES_SECONDARY_GEOGRAPHY } from './hard-queries';
import { PHYSICAL_SECONDARY_QUERIES } from './physical';

/**
 * All standard SECONDARY Geography ground truth queries.
 */
export const GEOGRAPHY_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] =
  PHYSICAL_SECONDARY_QUERIES;

/**
 * Hard SECONDARY Geography ground truth queries.
 */
export const GEOGRAPHY_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] =
  HARD_QUERIES_SECONDARY_GEOGRAPHY;

/**
 * All SECONDARY Geography ground truth queries.
 */
export const GEOGRAPHY_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_SECONDARY_STANDARD_QUERIES,
  ...GEOGRAPHY_SECONDARY_HARD_QUERIES,
] as const;

export { HARD_QUERIES_SECONDARY_GEOGRAPHY, PHYSICAL_SECONDARY_QUERIES };
