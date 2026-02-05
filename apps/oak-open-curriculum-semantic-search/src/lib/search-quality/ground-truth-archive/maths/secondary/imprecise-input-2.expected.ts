/**
 * Expected relevance for imprecise-input-2 ground truth.
 * Query: "pythagorus theorum triangles" (misspellings)
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_2_EXPECTED: ExpectedRelevance = {
  'demonstrating-pythagoras-theorem': 3,
  'checking-and-securing-understanding-of-pythagoras-theorem': 3,
  'further-demonstrating-of-pythagoras-theorem': 2,
  'pythagoras-theorem-in-context': 2,
  'problem-solving-with-similarity-and-pythagoras-theorem': 2,
} as const;
