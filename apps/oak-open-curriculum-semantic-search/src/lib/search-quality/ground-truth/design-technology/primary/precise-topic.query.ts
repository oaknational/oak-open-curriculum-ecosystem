/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const DESIGN_TECHNOLOGY_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'cam mechanisms automata',
  category: 'precise-topic',
  description: 'Tests DT mechanism vocabulary retrieval',
  expectedFile: './precise-topic.expected.ts',
} as const;
