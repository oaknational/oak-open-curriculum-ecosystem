/**
 * Query definition for cross-topic ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'shapes symmetry patterns',
  category: 'cross-topic',
  description:
    'Tests cross-topic capability: combines geometry (shapes) with symmetry and pattern recognition',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
