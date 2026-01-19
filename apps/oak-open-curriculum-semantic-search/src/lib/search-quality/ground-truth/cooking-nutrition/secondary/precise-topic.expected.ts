/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const COOKING_NUTRITION_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'macronutrients-fibre-and-water': 3,
} as const;
