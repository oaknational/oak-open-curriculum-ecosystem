/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'French verbs and vocabulary together',
  category: 'cross-topic',
  description: 'Tests intersection of verbs with vocabulary building - expected slugs must have ',
  expectedFile: './cross-topic.expected.ts',
} as const;
