/**
 * Query definition for precise-topic ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_PRECISE_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'calculating mean from frequency table',
  category: 'precise-topic',
  description:
    'Tests retrieval of statistics content - calculating mean from grouped data using precise curriculum terminology',
  expectedFile: './precise-topic-3.expected.ts',
} as const;
