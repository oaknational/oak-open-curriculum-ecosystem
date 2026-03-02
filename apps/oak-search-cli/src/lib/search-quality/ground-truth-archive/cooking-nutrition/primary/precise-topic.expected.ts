/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'why-we-need-energy-and-nutrients': 3,
  'sources-of-energy-and-nutrients': 3,
  'introducing-the-eatwell-guide': 3,
  'health-and-wellbeing': 2,
  'healthy-meals': 2,
} as const;
