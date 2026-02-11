/**
 * Query definition for precise-topic-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_PRECISE_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'electromagnetic spectrum waves',
  category: 'precise-topic',
  description: 'Tests retrieval of EM spectrum content using curriculum terminology',
  expectedFile: './precise-topic-3.expected.ts',
} as const;
