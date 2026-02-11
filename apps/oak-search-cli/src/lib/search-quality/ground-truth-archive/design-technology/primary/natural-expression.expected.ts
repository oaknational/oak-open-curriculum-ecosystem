/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const DESIGN_TECHNOLOGY_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'card-lever-mechanisms': 3,
  'card-slider-mechanisms': 3,
  'make-things-move-with-air': 3,
  'rotary-motion': 2,
} as const;
