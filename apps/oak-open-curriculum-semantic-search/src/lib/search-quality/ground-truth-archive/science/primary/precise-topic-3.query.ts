/**
 * Query definition for precise-topic-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_3_QUERY: GroundTruthQueryDefinition = {
  query: 'states of matter solids liquids gases',
  category: 'precise-topic',
  description: 'Tests retrieval of states of matter content using curriculum terminology',
  expectedFile: './precise-topic-3.expected.ts',
} as const;
