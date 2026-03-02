/**
 * Query definition for precise-topic ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'multiplication arrays year 3',
  category: 'precise-topic',
  description:
    'Tests retrieval of multiplication using arrays representation - curriculum terminology for visual multiplication model',
  expectedFile: './precise-topic-2.expected.ts',
} as const;
