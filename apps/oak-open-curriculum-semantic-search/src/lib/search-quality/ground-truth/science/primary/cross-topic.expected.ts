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

export const SCIENCE_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'what-animals-eat': 3,
  'animal-structure': 2,
} as const;
