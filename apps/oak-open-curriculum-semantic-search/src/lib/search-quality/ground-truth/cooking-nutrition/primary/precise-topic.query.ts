/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'healthy eating nutrition',
  category: 'precise-topic',
  description:
    'Tests curriculum terminology for healthy eating and nutrition. Score=3 for foundational lessons about nutrition concepts or the Eatwell Guide framework. Score=2 for practical application lessons.',
  expectedFile: './precise-topic.expected.ts',
} as const;
