/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'place value tens and ones',
  category: 'precise-topic',
  description: 'Tests retrieval of place value tens and ones content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
