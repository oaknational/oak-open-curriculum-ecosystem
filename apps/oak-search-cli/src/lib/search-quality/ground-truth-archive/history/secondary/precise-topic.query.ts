/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Holocaust Nazi persecution',
  category: 'precise-topic',
  description: 'Tests retrieval of Holocaust content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
