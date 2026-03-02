/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'a-journey-through-viking-york-merchants-and-traders': 3,
  'how-we-know-so-much-about-viking-york': 2,
} as const;
