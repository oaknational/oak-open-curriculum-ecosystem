/**
 * Expected relevance for cross-topic ground truth.
 * Query: "combining algebra with graphs"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'equations-and-their-graphs': 3,
  'solving-simultaneous-linear-equations-graphically': 3,
  'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 2,
  'solving-linear-equations-graphically-using-technology': 2,
  'relating-graphical-solutions-to-algebraic-solutions-for-inequalities': 2,
} as const;
