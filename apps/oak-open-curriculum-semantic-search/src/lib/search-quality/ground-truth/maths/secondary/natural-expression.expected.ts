/**
 * Expected relevance for natural-expression ground truth.
 * Query: "working out percentages from amounts"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'finding-a-percentage-with-a-multiplier': 3,
  'checking-and-securing-understanding-of-finding-a-percentage': 3,
  'securing-understanding-of-percentages': 3,
  'checking-understanding-of-percentages': 2,
  'expressing-one-number-as-a-percentage-of-another': 2,
} as const;
