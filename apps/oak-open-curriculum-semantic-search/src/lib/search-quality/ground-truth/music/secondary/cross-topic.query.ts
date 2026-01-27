/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'film music composition',
  category: 'cross-topic',
  description: 'Tests intersection of film music with composition skills',
  expectedFile: './cross-topic.expected.ts',
} as const;
