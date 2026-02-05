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
  // Directly about emotions and feelings in stories
  'comparing-emotions-and-feelings-in-paddington': 3,
  'exploring-emotions-in-the-final-year': 3,
  'exploring-characters-emotions': 3,
  // Related: understanding character perspectives/feelings
  'thinking-from-paddington-and-floella-benjamins-perspectives': 2,
} as const;
