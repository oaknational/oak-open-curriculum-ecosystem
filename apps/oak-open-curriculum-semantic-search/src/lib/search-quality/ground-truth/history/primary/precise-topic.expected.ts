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

export const HISTORY_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'boudicas-rebellion-against-roman-rule': 3,
  'the-roman-invasion-of-britain': 2,
} as const;
