/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Lessons explicitly teaching the verb "ser" and its conjugations
  'today-vs-in-general-son-and-estan': 3, // Teaches ser (son = "they are" from ser)
  'i-am-happy-the-verb-ser-soy-and-es': 3, // Explicit focus on ser (soy, es)
  'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3, // Teaches ser for traits
  'how-are-they-son-and-estan': 2, // Teaches ser (son = "they are")
  'how-is-she-es-and-esta': 2, // Teaches es (3rd person ser)
} as const;
