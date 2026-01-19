/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Buddhism beliefs practices',
  category: 'precise-topic',
  description: 'Tests retrieval of Buddhism content using curriculum terminology',
  expectedFile: './precise-topic.expected.ts',
} as const;
