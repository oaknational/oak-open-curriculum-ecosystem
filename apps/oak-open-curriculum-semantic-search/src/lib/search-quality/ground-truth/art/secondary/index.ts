/**
 * SECONDARY Art ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { ART_SECONDARY_HARD_QUERIES } from './hard-queries';
import { ART_SECONDARY_IDENTITY_QUERIES } from './identity-expression';
import { ART_SECONDARY_MOVEMENTS_QUERIES } from './art-movements';

export const ART_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_SECONDARY_MOVEMENTS_QUERIES,
  ...ART_SECONDARY_IDENTITY_QUERIES,
] as const;

export { ART_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Art ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const ART_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...ART_SECONDARY_STANDARD_QUERIES,
  ...ART_SECONDARY_HARD_QUERIES,
] as const;
