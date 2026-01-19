/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'compose-tangram-images': 3,
  'composing-pattern-block-images': 3,
  'tetrominoes-and-pentominoes': 2,
} as const;
