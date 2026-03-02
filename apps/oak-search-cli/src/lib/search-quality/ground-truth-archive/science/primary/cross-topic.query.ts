/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'habitats and food chains',
  category: 'cross-topic',
  description: 'Tests finding lessons that combine habitat concepts with food chain concepts',
  expectedFile: './cross-topic.expected.ts',
} as const;
