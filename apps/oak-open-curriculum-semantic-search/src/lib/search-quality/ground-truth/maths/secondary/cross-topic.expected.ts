/**
 * Expected relevance for cross-topic ground truth.
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
  'solving-simultaneous-linear-equations-graphically': 3,
  'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 3,
  'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
} as const;
