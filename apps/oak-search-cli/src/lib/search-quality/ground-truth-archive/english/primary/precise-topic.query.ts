/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'The BFG, Roald Dahl',
  category: 'precise-topic',
  description: 'Tests retrieval of The BFG reading content',
  expectedFile: './precise-topic.expected.ts',
} as const;
