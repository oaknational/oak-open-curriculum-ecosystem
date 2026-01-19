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

export const COMPUTING_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'painting-using-computers': 3,
  'creating-digital-pictures-in-the-style-of-an-artist': 2,
  'choosing-the-right-digital-painting-tool': 2,
  'using-lines-and-shapes-to-create-digital-pictures': 2,
} as const;
