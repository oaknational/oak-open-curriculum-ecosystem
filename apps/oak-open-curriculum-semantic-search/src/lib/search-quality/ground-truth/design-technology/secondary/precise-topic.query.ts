/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'ergonomics design human factors',
  category: 'precise-topic',
  description: 'Direct curriculum term match for ergonomics/anthropometrics/human factors content',
  expectedFile: './precise-topic.expected.ts',
} as const;
