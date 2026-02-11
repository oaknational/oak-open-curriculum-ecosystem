/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'what-does-fairness-mean-in-society': 3,
  'why-do-we-need-laws-on-equality-in-the-uk': 2,
  'what-are-rights-and-where-do-they-come-from': 2,
} as const;
