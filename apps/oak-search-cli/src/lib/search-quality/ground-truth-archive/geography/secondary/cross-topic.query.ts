/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'river erosion and deposition landforms',
  category: 'cross-topic',
  description: 'Cross-topic: erosion + deposition + landforms',
  expectedFile: './cross-topic.expected.ts',
} as const;
