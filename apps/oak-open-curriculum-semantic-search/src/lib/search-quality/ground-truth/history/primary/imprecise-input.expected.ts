/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'early-viking-raids': 3,
  'why-the-vikings-came-to-britain': 3,
  'the-anglo-saxon-fightback': 2,
} as const;
