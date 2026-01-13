/**
 * Primary Geography ground truth queries for search quality evaluation.
 *
 * **Structure (2026-01-11)**: 4 queries total, 1 per category, AI-curated.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { GEOGRAPHY_PRIMARY_CROSS_TOPIC } from './cross-topic';
import { GEOGRAPHY_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
import { GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
import { GEOGRAPHY_PRIMARY_PRECISE_TOPIC } from './precise-topic';

export const GEOGRAPHY_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_PRIMARY_PRECISE_TOPIC,
  ...GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION,
  ...GEOGRAPHY_PRIMARY_IMPRECISE_INPUT,
  ...GEOGRAPHY_PRIMARY_CROSS_TOPIC,
] as const;

export { GEOGRAPHY_PRIMARY_CROSS_TOPIC } from './cross-topic';
export { GEOGRAPHY_PRIMARY_IMPRECISE_INPUT } from './imprecise-input';
export { GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION } from './natural-expression';
export { GEOGRAPHY_PRIMARY_PRECISE_TOPIC } from './precise-topic';
