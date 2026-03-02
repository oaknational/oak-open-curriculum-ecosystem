/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'singing-and-moving-together': 3,
  'learning-about-beat': 2,
} as const;
