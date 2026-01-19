/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'predator and prey ecosystem relationships',
  category: 'cross-topic',
  description: 'Cross-topic intersection: ecology + behaviour',
  expectedFile: './cross-topic.expected.ts',
} as const;
