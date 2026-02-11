/**
 * Expected relevance for cross-topic-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'genetic-material-and-dna': 3,
  'dna-chromosomes-genes-and-the-genome': 3,
  'reproduction-and-inheritance': 2,
  'heredity-and-genetic-material': 2,
} as const;
