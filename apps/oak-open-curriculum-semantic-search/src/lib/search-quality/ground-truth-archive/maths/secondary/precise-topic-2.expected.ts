/**
 * Expected relevance for precise-topic-2 ground truth.
 * Query: "interior angles polygons"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_PRECISE_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'interior-angles-of-a-polygon': 3,
  'deriving-the-sum-of-interior-angles-in-multiple-ways': 3,
  'the-sum-of-the-interior-angles-of-any-triangle': 3,
  'interior-and-exterior-angles-of-regular-polygons': 2,
  'checking-and-securing-understanding-of-interior-angles': 2,
} as const;
