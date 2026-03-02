/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'programming and code sequences',
  category: 'cross-topic',
  description: 'Tests programming + sequences intersection. Score=3 is the foundational lesson (',
  expectedFile: './cross-topic.expected.ts',
} as const;
