/**
 * Query definition for cross-topic ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'multiplication area rectangles',
  category: 'cross-topic',
  description:
    'Tests cross-topic capability: combines arithmetic (multiplication) with geometry (area of rectangles) - cross-strand connection',
  expectedFile: './cross-topic-3.expected.ts',
} as const;
