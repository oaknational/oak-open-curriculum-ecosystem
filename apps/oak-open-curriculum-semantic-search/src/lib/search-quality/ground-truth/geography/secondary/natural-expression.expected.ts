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

export const GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'effects-of-climate-change-on-people-and-the-environment': 3,
  'impacts-of-climate-change-on-the-uk': 3,
  'the-impacts-of-climate-change-on-tuvalu': 2,
} as const;
