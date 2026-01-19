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

export const RELIGIOUS_EDUCATION_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'guru-nanak': 3,
  'guru-nanaks-teachings-on-equality-and-acceptance': 2,
} as const;
