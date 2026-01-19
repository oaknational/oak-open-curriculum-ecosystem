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

export const COOKING_NUTRITION_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'eat-well-now': 3,
  'making-better-food-and-drink-choices': 2,
} as const;
