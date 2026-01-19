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

export const ENGLISH_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'improving-an-essay-about-the-tempest': 3,
  'persuasive-opinion-pieces': 3,
  'revising-and-editing-essays': 2,
  'using-punctuation-to-create-specific-effects': 2,
} as const;
