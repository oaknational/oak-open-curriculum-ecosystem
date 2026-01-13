/**
 * Secondary History ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**: 4 queries total, 1 per category, AI-curated.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { HISTORY_SECONDARY_CROSS_TOPIC } from './cross-topic';
import { HISTORY_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
import { HISTORY_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
import { HISTORY_SECONDARY_PRECISE_TOPIC } from './precise-topic';

export const HISTORY_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...HISTORY_SECONDARY_PRECISE_TOPIC,
  ...HISTORY_SECONDARY_NATURAL_EXPRESSION,
  ...HISTORY_SECONDARY_IMPRECISE_INPUT,
  ...HISTORY_SECONDARY_CROSS_TOPIC,
] as const;

export { HISTORY_SECONDARY_CROSS_TOPIC } from './cross-topic';
export { HISTORY_SECONDARY_IMPRECISE_INPUT } from './imprecise-input';
export { HISTORY_SECONDARY_NATURAL_EXPRESSION } from './natural-expression';
export { HISTORY_SECONDARY_PRECISE_TOPIC } from './precise-topic';
