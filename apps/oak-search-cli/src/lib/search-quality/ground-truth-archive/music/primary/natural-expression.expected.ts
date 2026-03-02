/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // "singing in tune" = pitch accuracy, NOT timing
  'singing-with-pitch-accuracy': 3,
  'recognising-pitch-changes-in-our-singing-games': 3,
  'my-singing-voice': 2,
} as const;
