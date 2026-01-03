/**
 * KS3 Music ground truth queries.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { MUSIC_KS3_COMPOSITION_QUERIES } from './composition';
import { MUSIC_KS3_HARD_QUERIES } from './hard-queries';
import { MUSIC_KS3_PERFORMANCE_QUERIES } from './performance';

export const MUSIC_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_KS3_PERFORMANCE_QUERIES,
  ...MUSIC_KS3_COMPOSITION_QUERIES,
] as const;

export { MUSIC_KS3_HARD_QUERIES };

/**
 * All KS3 Music ground truth queries.
 *
 * Total: 9 queries (6 standard + 3 hard).
 */
export const MUSIC_KS3_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_KS3_STANDARD_QUERIES,
  ...MUSIC_KS3_HARD_QUERIES,
] as const;
