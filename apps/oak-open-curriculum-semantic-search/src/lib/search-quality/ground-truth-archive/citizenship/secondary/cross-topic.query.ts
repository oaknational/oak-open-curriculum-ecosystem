/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const CITIZENSHIP_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'democracy and laws together',
  category: 'cross-topic',
  description:
    'Tests multi-concept intersection: democracy + legal frameworks. Target lessons that explicitly connect democratic systems with rule of law.',
  expectedFile: './cross-topic.expected.ts',
} as const;
