/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3,
  'how-is-she-es-and-esta': 2,
} as const;
