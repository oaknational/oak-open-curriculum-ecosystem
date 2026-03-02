/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'protecting-food-chains': 3,
  'dangers-to-food-chains-non-statutory': 3,
  'changes-in-food-chains-non-statutory': 2,
} as const;
