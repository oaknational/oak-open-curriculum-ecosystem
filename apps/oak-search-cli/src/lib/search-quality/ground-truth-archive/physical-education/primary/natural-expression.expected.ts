/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Query "how to throw and catch" - EXACT title match and throwing-focused lessons
  'throwing-and-catching': 3,
  'throwing-with-accuracy': 3,
  'throwing-underarm': 3,
  'passing-and-receiving-using-our-hands': 2,
} as const;
