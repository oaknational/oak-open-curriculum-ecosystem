/**
 * Query definition for cross-topic ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'ratio proportion percentage',
  category: 'cross-topic',
  description:
    'Tests cross-topic capability: combines three related-but-distinct proportional reasoning concepts',
  expectedFile: './cross-topic-3.expected.ts',
} as const;
