/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // CORRECTED: Query is "why do people pray" - must have PRAYER content
  // Previous expected (guru-nanak) was completely misaligned with query
  'introducing-prayer': 3, // Search #4, MY #1 - directly about prayer
  'comparing-prayer-and-reflection': 3, // Search #3, MY #2 - prayer comparison
  'different-muslim-prayers': 2, // Search #2, MY #4 - prayer practices
  'different-christian-prayers': 2, // Search #6, MY #3 - prayer practices
  'salat-finding-harmony-through-daily-prayer': 2, // Search #10, MY #5 - prayer practice
} as const;
