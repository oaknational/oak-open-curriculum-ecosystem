/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'digital painting Year 1',
  category: 'precise-topic',
  description:
    'Tests KS1 digital painting term matching. All 4 expected slugs are from the Digital painting unit. Score=3 is the introduction lesson; score=2 are core technique lessons.',
  expectedFile: './precise-topic.expected.ts',
} as const;
