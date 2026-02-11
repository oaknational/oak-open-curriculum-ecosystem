/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'making-mushroom-bean-burgers-with-flatbreads': 3,
  'making-sweet-potato-katsu-curry': 3,
  'making-pea-and-mint-falafel-with-tzatziki': 2,
} as const;
