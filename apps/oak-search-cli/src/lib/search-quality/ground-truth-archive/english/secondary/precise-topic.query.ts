/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Lord of the Flies symbolism',
  category: 'precise-topic',
  description: 'Tests retrieval of Lord of the Flies symbolism/allegory content',
  expectedFile: './precise-topic.expected.ts',
} as const;
