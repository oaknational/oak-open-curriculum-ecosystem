/**
 * Expected relevance for precise-topic-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_PRECISE_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'forming-ions-for-ionic-bonding': 3,
  'forming-covalent-bonds': 3,
  'bonding-models': 2,
  'bonding-structure-and-properties': 2,
} as const;
