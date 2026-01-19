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

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'aerobic-cellular-respiration': 3,
  'anaerobic-cellular-respiration-in-humans': 3,
  'cellular-respiration': 2,
} as const;
