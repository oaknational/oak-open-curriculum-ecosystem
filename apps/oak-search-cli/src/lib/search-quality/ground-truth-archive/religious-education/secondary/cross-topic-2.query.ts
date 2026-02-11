/**
 * Query definition for cross-topic-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 *
 * This query tests sophisticated academic users who may search for specific
 * historical religious events while seeking cross-tradition comparisons.
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'East-West Schism and ecumenical movements compared with other religious traditions',
  category: 'cross-topic',
  description:
    'Academic query testing sophisticated users: specific historical event with cross-tradition comparison',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
