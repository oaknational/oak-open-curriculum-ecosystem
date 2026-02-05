/**
 * Expected relevance for natural-expression ground truth.
 * Query: "sharing equally into groups"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'explain-that-objects-can-be-shared-equally': 3,
  'use-skip-counting-to-solve-a-sharing-problem': 3,
  'skip-count-to-find-the-group-size-in-a-sharing-problem': 3,
  'explain-that-objects-can-be-grouped-equally': 2,
  'calculate-the-number-of-equal-groups-in-a-division-story': 2,
} as const;
