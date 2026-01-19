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
  'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
  'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
  'school-activities-infinitives-present-tense-3rd-person-singular': 2,
  'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 1,
} as const;
