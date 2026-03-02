/**
 * Query definition for future-intent ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./future-intent.expected.ts
 *
 * FUTURE-INTENT CATEGORY:
 * This query tests a capability that requires Level 3-4 search features
 * (intent classification, query rules, semantic reranking) that are not
 * yet implemented. It is EXCLUDED from aggregate statistics but remains
 * in benchmarks to track progress toward future capabilities.
 *
 * Why this query requires Level 4:
 * - "beginner" is an INTENT, not vocabulary — there is no curriculum term to bridge to
 * - "programming" IS curriculum vocabulary, so this is NOT a vocabulary bridging test
 * - Advanced lessons contain MORE "programming" content, so rank higher without intent detection
 * - Requires: query rules to boost lesson_order=1, or LLM intent classification
 *
 * @see ADR-082 for search quality levels
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_FUTURE_INTENT_QUERY: GroundTruthQueryDefinition = {
  query: 'coding for beginners programming basics introduction',
  category: 'future-intent',
  description:
    'Tests intent classification for beginner content. Requires Level 4 (AI Enhancement) — "beginner" is an intent signal, not vocabulary. Currently excluded from aggregate stats.',
  expectedFile: './future-intent.expected.ts',
} as const;
