/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Phase 1B + Search discovery: Both ser and estar verbs taught together
  'how-do-i-feel-today-ser-and-estar-together': 3, // Explicit "ser and estar together" lesson
  'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3, // Teaches ser vs estar distinction
  'how-are-we-somos-and-estamos': 2, // Plural forms of both verbs
  'today-vs-in-general-son-and-estan': 2, // Contrasts both verbs in usage
  'how-is-she-es-and-esta': 2, // Uses both es (ser) and está (estar)
} as const;
