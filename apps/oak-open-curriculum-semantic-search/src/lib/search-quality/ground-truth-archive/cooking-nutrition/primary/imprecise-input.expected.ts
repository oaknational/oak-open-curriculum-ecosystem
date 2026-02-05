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

export const COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'why-we-need-energy-and-nutrients': 3,
  'sources-of-energy-and-nutrients': 3,
  'food-labels-for-health': 3,
  'healthy-meals': 2,
  'health-and-wellbeing': 2,
} as const;
