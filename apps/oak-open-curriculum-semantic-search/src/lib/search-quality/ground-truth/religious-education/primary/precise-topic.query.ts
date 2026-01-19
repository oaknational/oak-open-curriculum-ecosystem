/**
 * Query definition for precise-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_PRECISE_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'Guru Nanak Sikhs',
  category: 'precise-topic',
  description: 'Tests Sikh religious figure and belief retrieval',
  expectedFile: './precise-topic.expected.ts',
} as const;
