/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'drawing marks Year 1',
  category: 'precise-topic',
  description: 'Tests year-specific mark-making curriculum retrieval',
  expectedFile: './precise-topic.expected.ts',
} as const;
