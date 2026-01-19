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

export const PHYSICAL_EDUCATION_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'passing-and-receiving-skills': 3,
  'dribbling-and-sending-with-hands': 2,
} as const;
