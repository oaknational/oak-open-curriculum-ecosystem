/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Spanish verb ser',
  category: 'precise-topic',
  description: 'Tests core verb concept retrieval in MFL',
  expectedFile: './precise-topic.expected.ts',
} as const;
