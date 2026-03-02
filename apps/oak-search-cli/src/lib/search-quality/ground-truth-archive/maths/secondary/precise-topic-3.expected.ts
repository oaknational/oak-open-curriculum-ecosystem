/**
 * Expected relevance for precise-topic-3 ground truth.
 * Query: "calculating mean from frequency table"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_PRECISE_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'calculating-the-mean-from-a-grouped-frequency-table': 3,
  'calculating-the-mean': 3,
  'calculating-summary-statistics-from-a-grouped-frequency-table': 2,
  'checking-understanding-of-summary-statistics-from-a-frequency-table': 2,
  'weighted-means': 2,
} as const;
