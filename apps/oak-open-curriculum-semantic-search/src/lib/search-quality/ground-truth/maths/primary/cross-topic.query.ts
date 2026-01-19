/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'pattern blocks tangrams',
  category: 'cross-topic',
  description: 'Combines two manipulative resources - tests multi-concept handling',
  expectedFile: './cross-topic.expected.ts',
} as const;
