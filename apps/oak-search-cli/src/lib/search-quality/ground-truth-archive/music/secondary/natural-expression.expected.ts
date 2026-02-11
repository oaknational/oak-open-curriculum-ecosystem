/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'singing-sea-shanties': 3,
  'modes-and-sea-shanties': 3,
  'characteristics-of-folk-songs': 2,
} as const;
