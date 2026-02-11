/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'singing beat, pulse',
  category: 'cross-topic',
  description: 'Tests intersection of singing skills with rhythm/pulse concepts',
  expectedFile: './cross-topic.expected.ts',
} as const;
