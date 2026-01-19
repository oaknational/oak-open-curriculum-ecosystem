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

export const GERMAN_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
  'school-activities-infinitives-present-tense-3rd-person-singular': 2,
} as const;
