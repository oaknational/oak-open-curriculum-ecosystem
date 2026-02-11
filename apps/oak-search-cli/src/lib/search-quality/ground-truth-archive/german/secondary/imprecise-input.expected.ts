/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const GERMAN_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Score 3: FOUNDATIONAL - defines weak verbs, ALL singular endings, "German only has one present tense"
  'famous-german-speakers-present-tense-weak-verbs-singular-persons': 3,
  // Score 3: COMPREHENSIVE - covers BOTH weak AND strong verb grammar in one lesson
  'feste-present-tense-weak-and-strong-verbs': 3,
  // Score 3: ADVANCED - special stem rules (d/t/m/n add 'e', s/ß/x/z, -el removal)
  'das-leben-mit-behinderung-stem-changes-in-present-tense-weak-verbs': 3,
  // Score 2: Singular + plural rules + German vs English comparison
  'interview-with-a-musician-present-tense-weak-verbs-yes-no-questions': 2,
} as const;
