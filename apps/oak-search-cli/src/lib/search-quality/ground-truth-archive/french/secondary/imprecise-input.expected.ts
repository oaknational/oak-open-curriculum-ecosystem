/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const FRENCH_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'jobs-singular-avoir-or-etre-questions-with-est-ce-que': 3,
  'my-everyday-avoir-and-etre-for-feelings-and-states': 2,
} as const;
