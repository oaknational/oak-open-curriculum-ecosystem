/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'portraits and colour expression',
  category: 'cross-topic',
  description:
    'Tests intersection of portraits with colour/expression. Score=3 slug explicitly addresses paint+colour+emotion in portraits.',
  expectedFile: './cross-topic.expected.ts',
} as const;
