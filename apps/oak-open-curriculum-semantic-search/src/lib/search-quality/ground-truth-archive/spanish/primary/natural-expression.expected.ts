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

export const SPANISH_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Lessons teaching estar for states and/or location
  'i-am-pleased-estoy-and-esta-for-state': 3, // Estar for emotional states
  'how-are-you-today-today-estoy-and-estas-for-states': 3, // Explicit: estar for states
  'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3, // States vs traits
  'greetings-the-verb-estar': 2, // Introduces estar
} as const;
