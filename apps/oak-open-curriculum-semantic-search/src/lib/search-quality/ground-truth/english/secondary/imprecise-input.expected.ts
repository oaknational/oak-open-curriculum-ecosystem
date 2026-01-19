/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const ENGLISH_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'frankensteins-reaction-to-his-creation': 3,
  'frankenstein-and-the-gothic-context': 3,
  'frankensteins-regret': 2,
} as const;
