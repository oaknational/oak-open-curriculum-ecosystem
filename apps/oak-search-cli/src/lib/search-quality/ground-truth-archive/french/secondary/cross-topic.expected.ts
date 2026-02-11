/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const FRENCH_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'clean-up-re-verbs-adjectives': 3,
  'describe-people-etre-3rd-person-plural-and-regular-plural-adjectives': 2,
} as const;
