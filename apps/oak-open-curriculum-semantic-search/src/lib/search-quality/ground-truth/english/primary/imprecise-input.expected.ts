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

export const ENGLISH_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'writing-the-opening-of-the-iron-man': 3,
  'writing-the-build-up-of-the-iron-man-part-one': 3,
  'planning-the-opening-of-the-iron-man': 2,
} as const;
