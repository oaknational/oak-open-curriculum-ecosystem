/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const DESIGN_TECHNOLOGY_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'structures and materials testing',
  category: 'cross-topic',
  description:
    'Tests intersection of structures with materials - both bridge testing and playground materials',
  expectedFile: './cross-topic.expected.ts',
} as const;
