/**
 * KS4 History ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

import { HISTORY_KS4_HISTORIC_ENV_QUERIES } from './historic-environments';

/**
 * All KS4 History ground truth queries.
 */
export const HISTORY_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_KS4_HISTORIC_ENV_QUERIES,
] as const;

export { HISTORY_KS4_HISTORIC_ENV_QUERIES } from './historic-environments';
