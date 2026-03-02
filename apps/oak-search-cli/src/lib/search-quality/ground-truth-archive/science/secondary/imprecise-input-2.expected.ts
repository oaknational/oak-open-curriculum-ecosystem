/**
 * Expected relevance for imprecise-input-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_2_EXPECTED: ExpectedRelevance = {
  photosynthesis: 3,
  'adaptations-of-plants-for-photosynthesis-absorbing-light': 3,
  'adaptations-of-plants-for-photosynthesis-gas-exchange-and-stomata': 2,
  'plant-nutrition': 2,
} as const;
