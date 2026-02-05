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

export const ART_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'abstract-art-painting-using-different-stimuli': 3,
  'abstract-marks-respond-to-stimuli-by-painting': 2,
  'abstract-art-dry-materials-in-response-to-stimuli': 2,
} as const;
