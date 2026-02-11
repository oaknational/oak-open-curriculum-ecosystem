/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Film music + composition (all involve creating, not just analyzing)
  'scoring-a-film-scene': 3, // "create a piece of music for a short scene"
  'using-film-music-to-establish-mood': 3, // "create a simple piece of music"
  'developing-mood-in-film-music': 2, // "use texture to develop music for a film scene"
} as const;
