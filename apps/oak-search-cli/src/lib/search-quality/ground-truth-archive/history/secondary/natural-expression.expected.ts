/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'the-industrial-revolution-and-change-in-britain': 3,
  'the-industrial-revolution-and-urban-migration': 3,
  'inventions-of-the-industrial-revolution': 2,
} as const;
