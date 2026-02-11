/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'abstract painting techniques',
  category: 'precise-topic',
  description:
    'Direct curriculum term match for abstract painting. Tests whether search returns lessons specifically about painting techniques in abstract art.',
  expectedFile: './precise-topic.expected.ts',
} as const;
