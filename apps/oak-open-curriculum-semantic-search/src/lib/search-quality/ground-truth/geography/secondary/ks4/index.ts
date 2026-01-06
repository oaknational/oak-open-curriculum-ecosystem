/**
 * KS4 Geography ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

import { GEOGRAPHY_KS4_FIELDWORK_QUERIES } from './fieldwork';

/**
 * All KS4 Geography ground truth queries.
 */
export const GEOGRAPHY_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_KS4_FIELDWORK_QUERIES,
] as const;

export { GEOGRAPHY_KS4_FIELDWORK_QUERIES } from './fieldwork';
