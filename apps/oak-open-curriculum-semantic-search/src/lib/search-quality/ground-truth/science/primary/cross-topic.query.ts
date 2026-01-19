/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'animals and food together',
  category: 'cross-topic',
  description: 'Tests intersection of animal classification with nutrition/diet',
  expectedFile: './cross-topic.expected.ts',
} as const;
