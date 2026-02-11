/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'energy nutrients and healthy eating',
  category: 'cross-topic',
  description:
    'Tests multi-concept intersection: energy + nutrients + healthy eating. Score=3 for lessons explicitly combining all three (both nutrient lessons reference Eatwell Guide for healthy eating). Score=2 for practical cooking lessons in the ',
  expectedFile: './cross-topic.expected.ts',
} as const;
