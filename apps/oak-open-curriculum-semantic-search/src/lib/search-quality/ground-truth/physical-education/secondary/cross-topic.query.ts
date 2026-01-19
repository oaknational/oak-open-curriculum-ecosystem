/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'fitness and athletics together',
  category: 'cross-topic',
  description: 'Tests intersection of fitness training with athletics events',
  expectedFile: './cross-topic.expected.ts',
} as const;
