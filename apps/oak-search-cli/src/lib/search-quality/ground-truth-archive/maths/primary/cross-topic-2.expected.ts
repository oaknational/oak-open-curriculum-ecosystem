/**
 * Expected relevance for cross-topic-2 ground truth.
 * Query: "shapes symmetry patterns"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'investigate-symmetry-and-symmetrical-patterns': 3,
  'complete-a-symmetrical-pattern': 3,
  'find-lines-of-symmetry-in-2d-shapes': 3,
  'investigate-lines-of-symmetry-in-2d-shapes-by-folding': 2,
  'explore-symmetry-by-joining-two-identical-shapes': 2,
} as const;
