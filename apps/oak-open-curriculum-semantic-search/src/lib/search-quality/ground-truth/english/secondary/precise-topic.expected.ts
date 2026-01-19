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

export const ENGLISH_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'goldings-use-of-symbolism-in-lord-of-the-flies': 3,
  'structure-allegory-and-genre-in-lord-of-the-flies': 2,
  'allusions-in-lord-of-the-flies': 2,
  'goldings-message-about-human-behaviour': 2,
} as const;
