/**
 * Expected relevance for natural-expression-2 ground truth.
 * Query: "counting in groups of"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED: ExpectedRelevance = {
  'count-efficiently-in-groups-of-two': 3,
  'count-efficiently-in-groups-of-ten': 3,
  'count-groups-of-10-in-decade-numbers': 3,
  'skip-count-using-the-group-size-to-find-the-number-of-groups': 2,
  'represent-counting-in-fives-as-the-5-times-table': 2,
} as const;
