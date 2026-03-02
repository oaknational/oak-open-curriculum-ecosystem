/**
 * Query definition for precise-topic-4 ground truth.
 *
 * Control query for imprecise-input-2 "multiplikation timetables year 3" - tests same
 * expected slugs with correct spelling to isolate fuzzy matching and tokenization effects.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./precise-topic-4.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_4_QUERY: GroundTruthQueryDefinition = {
  query: 'multiplication times tables year 3',
  category: 'precise-topic',
  description:
    'Control query for imprecise-input-2 (no typos) - compare with "multiplikation timetables year 3" to isolate fuzzy matching and tokenization effects',
  expectedFile: './precise-topic-4.expected.ts',
} as const;
