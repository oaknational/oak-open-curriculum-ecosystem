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

export const CITIZENSHIP_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'how-can-we-tell-if-the-uk-is-democratic': 3,
  'how-do-elections-in-the-uk-work': 3,
  'why-does-voting-matter': 2,
} as const;
