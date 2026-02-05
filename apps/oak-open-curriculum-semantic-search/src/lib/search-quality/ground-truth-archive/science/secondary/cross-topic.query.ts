/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'energy and chemical reactions',
  category: 'cross-topic',
  description: 'Tests finding lessons combining energy concepts with chemical reactions',
  expectedFile: './cross-topic.expected.ts',
} as const;
