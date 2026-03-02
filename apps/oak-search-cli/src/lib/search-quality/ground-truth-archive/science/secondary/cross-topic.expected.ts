/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'energy-changes-in-reactions': 3,
  'exothermic-and-endothermic-chemical-reactions': 3,
  'breaking-and-making-bonds': 2,
  'why-chemical-reactions-happen': 2,
} as const;
