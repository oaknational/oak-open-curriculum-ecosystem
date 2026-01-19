/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'French ER verbs singular',
  category: 'precise-topic',
  description: 'Tests verb conjugation grammar topic matching',
  expectedFile: './precise-topic.expected.ts',
} as const;
