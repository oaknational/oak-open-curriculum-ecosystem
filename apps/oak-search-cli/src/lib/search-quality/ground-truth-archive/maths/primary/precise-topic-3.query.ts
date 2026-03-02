/**
 * Query definition for precise-topic ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'equivalent fractions same value',
  category: 'precise-topic',
  description:
    'Tests retrieval of equivalent fractions content - fundamental fractions concept using curriculum terminology',
  expectedFile: './precise-topic-3.expected.ts',
} as const;
