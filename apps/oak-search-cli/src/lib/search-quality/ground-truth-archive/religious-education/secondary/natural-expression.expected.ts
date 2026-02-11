/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Query: "right and wrong philosophy" - good alignment across sources
  // Expanded to include top search results
  'christian-teachings-about-good-and-evil': 3, // Search #1, MY #1 - directly relevant
  'the-nature-of-human-goodness': 3, // Search #5, Original expected
  'virtue-ethics': 3, // Search #6, Original expected
  'deontology-and-immanuel-kant': 2, // Search #4, Original expected
  'situation-ethics': 2, // Search #7, MY #4 - ethics framework
} as const;
