/**
 * Query definition for cross-topic-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'electricity and magnetism motors',
  category: 'cross-topic',
  description: 'Tests finding lessons combining electricity with magnetism/motors',
  expectedFile: './cross-topic-3.expected.ts',
} as const;
