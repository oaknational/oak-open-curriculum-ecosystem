/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'fitness training FITT principle intensity programme design',
  category: 'precise-topic',
  description: 'Direct curriculum term match for fitness unit',
  expectedFile: './precise-topic.expected.ts',
} as const;
