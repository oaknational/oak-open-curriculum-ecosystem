/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'programming with data structures loops',
  category: 'cross-topic',
  description:
    'Tests intersection of programming + data structures + loops - both expected slugs explicitly cover iteration through data structures',
  expectedFile: './cross-topic.expected.ts',
} as const;
