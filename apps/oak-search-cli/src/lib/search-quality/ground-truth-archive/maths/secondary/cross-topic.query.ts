/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'algebra graphs, linear equations',
  category: 'cross-topic',
  description: 'Cross-topic intersection: algebra and graphing overlap',
  expectedFile: './cross-topic.expected.ts',
} as const;
