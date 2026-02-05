/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const DESIGN_TECHNOLOGY_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'sketching and materials properties',
  category: 'cross-topic',
  description: 'Tests intersection of design sketching/rendering with materials representation',
  expectedFile: './cross-topic.expected.ts',
} as const;
