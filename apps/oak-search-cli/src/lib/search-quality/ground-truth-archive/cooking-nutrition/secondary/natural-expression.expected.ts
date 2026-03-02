/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'making-herby-focaccia': 3,
  'making-chelsea-buns': 2,
} as const;
