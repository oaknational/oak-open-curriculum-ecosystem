/**
 * Expected relevance for natural-expression-2 ground truth.
 * Query: "finding the unknown number"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * Phase 1C Review (2026-01-20):
 * Changed from quadratic equation slugs to linear equation slugs.
 * "Finding the unknown number" is basic/informal algebra language that maps
 * to LINEAR equations, not advanced quadratic solving. Search correctly
 * prioritised linear equation lessons over quadratics.
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_2_EXPECTED: ExpectedRelevance = {
  'problem-solving-with-linear-equations': 3,
  'solving-simple-linear-equations-with-an-additive-step': 3,
  'checking-and-securing-understanding-of-solving-and-interpreting-linear-equations': 3,
  'preparing-to-solve-two-step-linear-equations': 2,
  'solving-simple-linear-equations-with-a-multiplicative-step': 2,
} as const;
