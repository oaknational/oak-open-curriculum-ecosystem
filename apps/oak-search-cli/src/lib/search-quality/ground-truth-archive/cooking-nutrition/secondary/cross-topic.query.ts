/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'nutrition and cooking techniques together',
  category: 'cross-topic',
  description: 'Tests intersection of nutrition theory with practical cooking skills',
  expectedFile: './cross-topic.expected.ts',
} as const;
