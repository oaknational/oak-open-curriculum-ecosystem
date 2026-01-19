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

export const SPANISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'greetings-the-verb-estar': 3,
  'how-are-you-today-today-estoy-and-estas-for-states': 2,
} as const;
