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

export const SPANISH_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'un-estudiante-inmigrante-plural-nouns-indefinite-articles': 3,
  'las-fallas-de-valencia-alguno-meaning-some': 2,
} as const;
