/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'UK countries capitals',
  category: 'precise-topic',
  description: 'Tests UK geography locational knowledge retrieval',
  expectedFile: './precise-topic.expected.ts',
} as const;
