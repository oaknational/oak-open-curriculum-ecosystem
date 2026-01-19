/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'creating-scary-music': 3,
  'tension-in-early-movies': 2,
} as const;
