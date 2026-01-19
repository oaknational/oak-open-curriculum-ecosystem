/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'maps and teamwork outdoor activities',
  category: 'cross-topic',
  description: 'Tests intersection of navigation skills with teamwork in OAA',
  expectedFile: './cross-topic.expected.ts',
} as const;
