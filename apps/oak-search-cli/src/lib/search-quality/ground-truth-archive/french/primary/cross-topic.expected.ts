/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const FRENCH_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'preferences-extending-my-sentences': 3,
  'who-has-what-singular-avoir-and-intonation-questions': 2,
} as const;
