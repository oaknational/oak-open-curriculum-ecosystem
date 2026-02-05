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

export const GEOGRAPHY_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'the-uk-and-its-surrounding-seas': 3,
  'mapping-the-coast': 2,
} as const;
