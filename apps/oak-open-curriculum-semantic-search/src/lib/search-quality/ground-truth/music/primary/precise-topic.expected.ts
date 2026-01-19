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

export const MUSIC_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'syncopation-in-songs': 3,
  'syncopated-rhythms': 2,
} as const;
