/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // KS1 rhythm/beat basics (syncopated-rhythms removed - KS2 concept)
  // Query mentions both "rhythm" and "beat" - vary scores for ranking
  'learning-about-beat': 3,
  'rhythm-and-beat': 3,
  'learning-about-rhythm': 2,
} as const;
