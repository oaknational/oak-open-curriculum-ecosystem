/**
 * Primary Music ground truth queries - 4 queries, 1 per category, AI-curated.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';
import { MUSIC_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { MUSIC_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { MUSIC_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { MUSIC_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const MUSIC_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_PRIMARY_PRECISE_TOPIC,
  ...MUSIC_PRIMARY_NATURAL_EXPRESSION,
  ...MUSIC_PRIMARY_IMPRECISE_INPUT,
  ...MUSIC_PRIMARY_CROSS_TOPIC,
] as const;

export { MUSIC_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { MUSIC_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { MUSIC_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { MUSIC_PRIMARY_PRECISE_TOPIC } from './precise-topic';
