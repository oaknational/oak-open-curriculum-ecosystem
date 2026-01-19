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

export const RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'dhamma-moral-precepts': 3,
  'dhamma-skilful-actions': 3,
  'siddhartha-gautama-as-a-historical-figure': 2,
} as const;
