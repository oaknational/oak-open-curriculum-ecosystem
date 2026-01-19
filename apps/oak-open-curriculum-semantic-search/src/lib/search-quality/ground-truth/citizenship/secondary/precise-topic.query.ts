/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const CITIZENSHIP_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'democracy voting elections UK',
  category: 'precise-topic',
  description: 'Tests direct term matching for UK democracy/elections/voting curriculum content',
  expectedFile: './precise-topic.expected.ts',
} as const;
