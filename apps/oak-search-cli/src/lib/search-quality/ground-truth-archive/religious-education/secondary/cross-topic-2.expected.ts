/**
 * Expected relevance for cross-topic-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * NOTE: This is a placeholder. Expected slugs will be determined during
 * Phase 1B exhaustive discovery using bulk data and MCP tools.
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  // Query: "East-West Schism and ecumenical movements compared with other religious traditions"
  // Academic query - curriculum gap exists (no direct Schism content)
  'the-trinity-and-orthodox-christianity': 3, // Search #3, ALL THREE - Filioque central to Schism
  reconciliation: 3, // Search #1 - ecumenical/reconciliation theme
  'working-for-reconciliation': 2, // Search #2 - ecumenical movement
  'predestination-across-denominations': 2, // MY #3, Original expected - cross-denominational
  'coptic-christianity-desert-fathers-and-mothers': 1, // Search #4 - Eastern Christianity
} as const;
