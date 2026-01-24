/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'dribbling-with-our-feet-in-games': 3,
  'develop-moving-with-the-ball-using-our-feet-dribbling': 3,
  'moving-with-a-ball-using-our-feet': 2,
} as const;
