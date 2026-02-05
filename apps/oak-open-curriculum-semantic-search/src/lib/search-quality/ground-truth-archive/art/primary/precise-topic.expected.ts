/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const ART_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'how-artists-make-marks': 3,
  'expressive-mark-making': 2,
} as const;
