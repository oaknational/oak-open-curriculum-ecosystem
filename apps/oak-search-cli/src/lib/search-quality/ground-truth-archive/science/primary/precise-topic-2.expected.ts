/**
 * Expected relevance for precise-topic-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'electrical-conductors-and-insulators': 3,
  'choosing-and-using-conductors-and-insulators-non-statutory': 3,
  'electrical-conductors-testing': 2,
  'how-electrical-insulators-keep-us-safe-non-statutory': 2,
} as const;
