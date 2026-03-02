/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const COMPUTING_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'connecting-networks': 3,
  'the-internet-and-world-wide-web': 2,
} as const;
