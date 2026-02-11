/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'maps and forests together',
  category: 'cross-topic',
  description: 'Tests intersection of mapping skills with environmental topics',
  expectedFile: './cross-topic.expected.ts',
} as const;
