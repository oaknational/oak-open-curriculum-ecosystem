/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GERMAN_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'verbs and questions in German',
  category: 'cross-topic',
  description: 'Tests intersection of verb conjugation with question formation',
  expectedFile: './cross-topic.expected.ts',
} as const;
