/**
 * Expected relevance for precise-topic ground truth.
 * Query: "place value tens and ones"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'partition-two-digit-numbers-into-tens-and-ones-using-place-value-resources': 3,
  'partition-two-digit-numbers-into-tens-and-ones': 3,
  'count-groups-of-ten-and-extra-ones': 3,
  'represent-a-number-from-20-to-99': 2,
  'count-a-large-group-of-objects-by-counting-tens-and-ones': 2,
} as const;
