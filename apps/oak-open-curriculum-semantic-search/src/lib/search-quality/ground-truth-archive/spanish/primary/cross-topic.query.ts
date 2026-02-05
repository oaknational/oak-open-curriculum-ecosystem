/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Spanish verbs ser and estar together',
  category: 'cross-topic',
  description: 'Tests intersection of two key Spanish verb concepts',
  expectedFile: './cross-topic.expected.ts',
} as const;
