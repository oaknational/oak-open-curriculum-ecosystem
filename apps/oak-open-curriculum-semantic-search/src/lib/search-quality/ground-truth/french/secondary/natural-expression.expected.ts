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

export const FRENCH_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'what-isnt-happening-ne-pas-negation': 3,
  'what-people-do-and-dont-do-ne-pas-negation': 2,
} as const;
