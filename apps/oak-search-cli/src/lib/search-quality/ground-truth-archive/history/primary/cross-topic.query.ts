/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Vikings and trade in York',
  category: 'cross-topic',
  description: 'Tests intersection of Viking history with economic/trade topics',
  expectedFile: './cross-topic.expected.ts',
} as const;
