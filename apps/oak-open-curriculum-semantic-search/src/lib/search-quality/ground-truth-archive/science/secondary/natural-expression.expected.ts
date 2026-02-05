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

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  photosynthesis: 3,
  'adaptations-of-plants-for-photosynthesis-absorbing-light': 3,
  'adaptations-of-plants-for-photosynthesis-gas-exchange-and-stomata': 2,
  'plant-nutrition': 2,
} as const;
