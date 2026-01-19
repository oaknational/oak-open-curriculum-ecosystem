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

export const ENGLISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'thinking-from-different-perspectives-jack-and-the-beanstalk': 3,
  'thinking-from-lulus-perspective-and-asking-questions': 3,
  'thinking-from-paddington-and-floella-benjamins-perspectives': 3,
  'developing-reading-preferences-in-year-3-through-appreciation-of-characters': 2,
} as const;
