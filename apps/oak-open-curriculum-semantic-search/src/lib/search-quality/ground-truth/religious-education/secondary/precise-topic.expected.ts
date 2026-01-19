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

export const RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'siddhartha-gautama-as-a-historical-figure': 3,
  'the-buddha-through-the-eyes-of-devotees': 2,
  'dhamma-moral-precepts': 2,
  'dhamma-skilful-actions': 1,
} as const;
