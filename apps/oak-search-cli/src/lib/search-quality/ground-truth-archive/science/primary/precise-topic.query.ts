/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'evolution Darwin finches Year 6',
  category: 'precise-topic',
  description: 'Tests retrieval of Darwin evolution content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
