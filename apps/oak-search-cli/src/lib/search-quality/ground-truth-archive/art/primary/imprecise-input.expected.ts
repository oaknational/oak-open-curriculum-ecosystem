/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const ART_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'explore-a-variety-of-painting-techniques': 3,
  'mixing-secondary-colours-autumn-oranges': 2,
} as const;
