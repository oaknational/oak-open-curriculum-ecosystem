/**
 * Query definition for cross-topic-2 ground truth.
 *
 * Control query for imprecise-input "vikins and anglo saxons" - tests same
 * expected slugs with correct spelling to isolate fuzzy matching effects.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_PRIMARY_CROSS_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'Vikings and Anglo-Saxons Britain',
  category: 'cross-topic',
  description:
    'Control query for imprecise-input (no typos) - compare with "vikins and anglo saxons" to isolate fuzzy matching effects',
  expectedFile: './cross-topic-2.expected.ts',
} as const;
