/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const ENGLISH_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'writing-sentences-in-the-simple-present-past-and-future-tense': 3,
  'writing-sentences-in-the-progressive-present-past-and-future-tense': 3,
  'writing-sentences-in-the-perfect-present-tense': 2,
} as const;
