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

export const GEOGRAPHY_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'mapping-trees-locally': 3,
  'mapping-changes-in-the-uks-forests': 2,
} as const;
