/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Spanish adjectives and noun agreement',
  category: 'cross-topic',
  description: 'Tests intersection of adjective forms with noun gender/number agreement',
  expectedFile: './cross-topic.expected.ts',
} as const;
