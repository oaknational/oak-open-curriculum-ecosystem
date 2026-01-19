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

export const SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'predator-prey-relationships': 3,
  'adaptations-of-predators-and-prey': 3,
  'food-webs': 2,
} as const;
