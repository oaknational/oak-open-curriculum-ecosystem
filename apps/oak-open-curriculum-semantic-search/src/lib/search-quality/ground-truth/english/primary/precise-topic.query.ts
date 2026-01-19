/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'The BFG reading comprehension Roald Dahl Year 3',
  category: 'precise-topic',
  description: 'Tests retrieval of The BFG reading content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
