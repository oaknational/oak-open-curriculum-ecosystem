/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const GEOGRAPHY_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'river-landforms-caused-by-erosion-and-deposition': 3,
  'river-processes-of-erosion-transportation-and-deposition': 3,
  'river-processes': 2,
} as const;
