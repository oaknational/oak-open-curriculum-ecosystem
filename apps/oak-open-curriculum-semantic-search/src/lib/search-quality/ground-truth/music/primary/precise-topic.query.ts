/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'syncopation rhythm music ks2',
  category: 'precise-topic',
  description: 'Tests rhythm concept vocabulary with key stage',
  expectedFile: './precise-topic.expected.ts',
} as const;
