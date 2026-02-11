/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'verbs and adjectives in French grammar',
  category: 'cross-topic',
  description: 'Tests intersection of verb conjugation with adjective agreement',
  expectedFile: './cross-topic.expected.ts',
} as const;
