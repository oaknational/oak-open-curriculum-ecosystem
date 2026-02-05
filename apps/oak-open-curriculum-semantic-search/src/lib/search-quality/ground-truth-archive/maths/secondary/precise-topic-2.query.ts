/**
 * Query definition for precise-topic ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-2.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_PRECISE_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'interior angles polygons',
  category: 'precise-topic',
  description:
    'Tests retrieval of geometry content - interior angles of polygons using precise curriculum terminology',
  expectedFile: './precise-topic-2.expected.ts',
} as const;
