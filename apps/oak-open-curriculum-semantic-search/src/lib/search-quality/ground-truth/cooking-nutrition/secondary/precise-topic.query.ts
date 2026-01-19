/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_SECONDARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'macronutrients and micronutrients nutrition',
  category: 'precise-topic',
  description: 'Tests scientific nutrition vocabulary retrieval',
  expectedFile: './precise-topic.expected.ts',
} as const;
