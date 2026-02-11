/**
 * Expected relevance for precise-topic-2 ground truth.
 * Query: "multiplication arrays year 3"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'explain-what-a-factor-is-and-use-arrays-and-multiplication-and-division-facts-to-find-them': 3,
  'explain-how-to-calculate-the-area-of-a-rectangle-using-multiplication': 3,
  'calculate-the-areas-of-rectangles-using-multiplication': 2,
  'represent-equal-groups-as-multiplication': 2,
  'identify-and-explain-each-part-of-a-multiplication-equation': 2,
} as const;
