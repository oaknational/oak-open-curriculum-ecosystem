/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'drum grooves rhythm',
  category: 'precise-topic',
  description: 'Direct curriculum term match for drum grooves units',
  expectedFile: './precise-topic.expected.ts',
} as const;
