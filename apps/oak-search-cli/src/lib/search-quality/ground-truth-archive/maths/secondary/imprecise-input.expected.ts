/**
 * Expected relevance for imprecise-input ground truth.
 * Query: "simulatneous equasions substitution method" (misspellings)
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'solving-simultaneous-linear-equations-by-substitution': 3,
  'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-using-substitution': 2,
  'solving-algebraic-simultaneous-equations-by-elimination': 2,
  'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
  'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-using-elimination': 2,
} as const;
