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

export const ART_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'draw-a-profile-portrait': 3,
  'analyse-a-facial-expression-through-drawing': 2,
} as const;
