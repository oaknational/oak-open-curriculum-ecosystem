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

export const HISTORY_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'nazi-persecution-of-jewish-people': 3,
  'the-holocaust-in-context': 2,
  'ghettos-and-the-final-solution': 2,
  'victims-and-perpetrators': 1,
} as const;
