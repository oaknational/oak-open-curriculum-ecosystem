/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'rainforest colour and texture painting',
  category: 'cross-topic',
  description: 'Tests intersection of colour theory and texture within themed art',
  expectedFile: './cross-topic.expected.ts',
} as const;
