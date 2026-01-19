/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'solving-quadratic-equations-by-factorising': 3,
  'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
  'factorising-a-quadratic-expression': 2,
} as const;
