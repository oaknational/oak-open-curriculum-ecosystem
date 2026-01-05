/**
 * SECONDARY Music ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { MUSIC_SECONDARY_COMPOSITION_QUERIES } from './composition';
import { MUSIC_SECONDARY_HARD_QUERIES } from './hard-queries';
import { MUSIC_SECONDARY_PERFORMANCE_QUERIES } from './performance';

export const MUSIC_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_SECONDARY_PERFORMANCE_QUERIES,
  ...MUSIC_SECONDARY_COMPOSITION_QUERIES,
] as const;

export { MUSIC_SECONDARY_HARD_QUERIES };

/**
 * All SECONDARY Music ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const MUSIC_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_SECONDARY_STANDARD_QUERIES,
  ...MUSIC_SECONDARY_HARD_QUERIES,
] as const;
