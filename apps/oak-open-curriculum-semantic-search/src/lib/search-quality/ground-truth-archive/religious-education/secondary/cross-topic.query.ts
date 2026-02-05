/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'sacred texts and ethical teachings',
  category: 'cross-topic',
  description: 'Tests intersection of two distinct RE concepts: scripture and moral philosophy',
  expectedFile: './cross-topic.expected.ts',
} as const;
