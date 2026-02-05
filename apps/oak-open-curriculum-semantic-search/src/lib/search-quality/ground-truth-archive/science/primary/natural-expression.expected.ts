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

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'charles-darwin-and-finches': 3,
  'the-survival-of-the-fittest': 2,
  'evolution-evidence': 2,
  'animal-adaptations': 2,
} as const;
