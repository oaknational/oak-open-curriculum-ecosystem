/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const ART_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'explore-the-shades-textures-and-colours-of-a-rainforest': 3,
  'paint-a-rainforest': 2,
} as const;
