/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'places of worship and religious festivals',
  category: 'cross-topic',
  description:
    'Tests intersection of two distinct RE concepts: sacred buildings and celebratory events',
  expectedFile: './cross-topic.expected.ts',
} as const;
