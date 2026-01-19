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

export const COOKING_NUTRITION_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'eat-well-now': 3,
  'macronutrients-fibre-and-water': 2,
} as const;
