/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COMPUTING_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'using-for-loops-to-iterate-data-structures': 3,
  'iterating-through-data-structures': 2,
} as const;
