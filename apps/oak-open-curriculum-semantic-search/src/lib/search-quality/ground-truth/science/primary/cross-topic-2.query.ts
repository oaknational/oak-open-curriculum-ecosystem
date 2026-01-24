/**
 * Query definition for cross-topic-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'light and plants growing',
  category: 'cross-topic',
  description: 'Tests finding lessons that combine light concepts with plant growth',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
