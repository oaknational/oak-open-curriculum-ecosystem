/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const DESIGN_TECHNOLOGY_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'polymers-properties-sources-and-stock-forms': 3,
  'polymer-properties-and-processes': 2,
} as const;
