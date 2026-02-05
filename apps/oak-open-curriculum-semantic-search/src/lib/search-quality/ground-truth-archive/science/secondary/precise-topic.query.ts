/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'cell structure and function',
  category: 'precise-topic',
  description: 'Tests retrieval of cell structure content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
