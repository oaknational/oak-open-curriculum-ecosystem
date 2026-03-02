/**
 * Query definition for cross-topic-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'cells and genetics inheritance',
  category: 'cross-topic',
  description: 'Tests finding lessons combining cell biology with genetics',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
