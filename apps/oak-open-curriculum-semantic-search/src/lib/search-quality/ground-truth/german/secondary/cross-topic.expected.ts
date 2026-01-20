/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const GERMAN_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Score 3: BOTH verb conjugation AND question formation in key learning
  'interview-with-a-musician-present-tense-weak-verbs-yes-no-questions': 3,
  // Score 3: BOTH separable verb rules AND question formation
  'everyday-experiences-present-tense-separable-verbs-questions': 3,
  // Score 2: Question formation with verb position
  'wer-ist-bella-was-macht-sie-present-tense-verbs-yes-no-questions': 2,
} as const;
