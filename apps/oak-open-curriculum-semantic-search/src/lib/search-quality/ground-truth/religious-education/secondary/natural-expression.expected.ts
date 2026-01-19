/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'the-nature-of-human-goodness': 3,
  'virtue-ethics': 3,
  'deontology-and-immanuel-kant': 2,
} as const;
