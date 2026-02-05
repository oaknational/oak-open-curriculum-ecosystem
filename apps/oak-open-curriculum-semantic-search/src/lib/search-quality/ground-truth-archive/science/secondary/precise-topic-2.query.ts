/**
 * Query definition for precise-topic-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-2.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_PRECISE_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'ionic and covalent bonding',
  category: 'precise-topic',
  description: 'Tests retrieval of chemical bonding content using curriculum terminology',
  expectedFile: './precise-topic-2.expected.ts',
} as const;
