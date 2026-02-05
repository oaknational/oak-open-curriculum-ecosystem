/**
 * Expected relevance for cross-topic-3 ground truth.
 * Query: "multiplication area rectangles"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'explain-how-to-calculate-the-area-of-a-rectangle-using-multiplication': 3,
  'calculate-the-areas-of-rectangles-using-multiplication': 3,
  'calculate-the-area-of-shapes-made-from-2-rectangles-by-decomposing-the-shape-in-different-ways': 2,
  'calculate-the-area-of-shapes-made-from-2-or-more-rectangles': 2,
} as const;
