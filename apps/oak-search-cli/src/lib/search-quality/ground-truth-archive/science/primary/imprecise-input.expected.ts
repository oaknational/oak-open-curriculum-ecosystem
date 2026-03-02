/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'evolution-evidence': 3,
  'animal-adaptations': 3,
  'charles-darwin-and-finches': 2,
  'the-survival-of-the-fittest': 2,
} as const;
