/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Python programming lists data structures projects',
  category: 'precise-topic',
  description: 'Direct curriculum term match for Python programming unit',
  expectedFile: './precise-topic.expected.ts',
} as const;
