/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const GEOGRAPHY_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  earthquakes: 3,
  'plate-boundaries': 2,
  'plate-tectonics-theory': 2,
} as const;
