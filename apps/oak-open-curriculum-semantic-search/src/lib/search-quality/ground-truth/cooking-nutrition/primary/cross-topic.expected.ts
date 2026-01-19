/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'sources-of-energy-and-nutrients': 3,
  'why-we-need-energy-and-nutrients': 3,
  'making-curry-in-a-hurry': 2,
} as const;
