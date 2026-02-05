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

export const HISTORY_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'the-role-of-the-haitian-revolution-in-the-abolition-of-the-slave-trade': 3,
  'the-causes-of-the-haitian-revolution': 2,
} as const;
