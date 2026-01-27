/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Core Roman Britain lessons
  'the-roman-invasion-of-britain': 3,
  'the-buildings-of-roman-britain': 3,
  // Related Roman Britain content
  'roman-kings': 2,
  'britain-at-the-end-of-roman-rule': 2,
  'towns-in-roman-britain': 2,
} as const;
