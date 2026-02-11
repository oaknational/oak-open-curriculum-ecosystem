/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'making-a-healthy-wrap-for-lunch': 3,
  'making-an-international-salad': 2,
  'healthy-meals': 2,
} as const;
