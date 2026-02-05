/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const GERMAN_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Score 3: FOUNDATIONAL - explicitly defines weak verbs and all present tense endings
  'famous-german-speakers-present-tense-weak-verbs-singular-persons': 3,
  // Score 3: Directly teaches weak verb conjugation rules
  'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
  // Score 2: Similar content, teaches weak verb endings
  'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
  // Score 2: Advanced weak verb content with stem variations
  'das-leben-mit-behinderung-stem-changes-in-present-tense-weak-verbs': 2,
} as const;
