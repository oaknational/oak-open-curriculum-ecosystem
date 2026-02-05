/**
 * Expected relevance for cross-topic-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'friction-do-and-review': 3,
  'different-surfaces-do-and-review': 3,
  'material-properties': 2,
  'properties-of-materials': 2,
} as const;
