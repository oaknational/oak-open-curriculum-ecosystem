/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'the-holocaust-in-context': 3,
  'nazi-persecution-of-jewish-people': 3,
  'ghettos-and-the-final-solution': 2,
} as const;
