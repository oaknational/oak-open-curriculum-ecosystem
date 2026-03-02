/**
 * Query definition for cross-topic ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'coordinate geometry proofs',
  category: 'cross-topic',
  description: 'Tests cross-topic capability: geometric proof with coordinate geometry',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
