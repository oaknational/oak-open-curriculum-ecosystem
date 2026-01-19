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

export const COMPUTING_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'creating-lists-in-python': 3,
  'data-structure-projects-in-python': 3,
  'python-list-operations': 2,
} as const;
