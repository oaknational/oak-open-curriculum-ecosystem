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

export const MATHS_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'recognise-and-name-the-fraction-one-half': 3,
  'recognise-and-name-the-fraction-one-quarter': 3,
  'find-one-half-of-a-number': 2,
} as const;
