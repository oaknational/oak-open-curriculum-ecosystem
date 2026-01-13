/**
 * Secondary Music ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { MUSIC_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { MUSIC_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { MUSIC_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { MUSIC_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const MUSIC_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_SECONDARY_PRECISE_TOPIC,
  ...MUSIC_SECONDARY_NATURAL_EXPRESSION,
  ...MUSIC_SECONDARY_IMPRECISE_INPUT,
  ...MUSIC_SECONDARY_CROSS_TOPIC,
] as const;

export { MUSIC_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { MUSIC_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { MUSIC_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { MUSIC_SECONDARY_PRECISE_TOPIC } from './precise-topic';
