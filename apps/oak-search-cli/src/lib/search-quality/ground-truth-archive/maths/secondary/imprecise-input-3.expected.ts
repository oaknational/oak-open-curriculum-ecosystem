/**
 * Expected relevance for imprecise-input-3 ground truth.
 * Query: "probablity tree diagrams" (misspelling)
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_3_EXPECTED: ExpectedRelevance = {
  'calculating-theoretical-probabilities-from-probability-tree-diagrams-one-event': 3,
  'calculating-theoretical-probabilities-from-probability-trees-two-events': 3,
  'conditional-probability-in-a-tree-diagram': 2,
  'algebra-in-tree-and-venn-diagrams': 2,
} as const;
