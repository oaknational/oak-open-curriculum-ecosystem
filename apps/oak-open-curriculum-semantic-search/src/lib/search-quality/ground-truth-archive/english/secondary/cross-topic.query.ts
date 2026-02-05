/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_SECONDARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'grammar and punctuation in essay writing',
  category: 'cross-topic',
  description: 'Tests intersection of grammar/punctuation with essay/writing improvement',
  expectedFile: './cross-topic.expected.ts',
} as const;
