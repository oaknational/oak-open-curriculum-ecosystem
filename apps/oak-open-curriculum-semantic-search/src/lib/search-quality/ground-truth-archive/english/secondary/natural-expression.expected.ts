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

export const ENGLISH_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'diving-deeper-into-the-gothic-genre': 3,
  'frankenstein-and-the-gothic-context': 3,
  'gothic-vocabulary-in-jane-eyre': 2,
} as const;
