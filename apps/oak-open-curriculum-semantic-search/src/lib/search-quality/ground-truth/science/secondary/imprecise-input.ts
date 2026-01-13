/**
 * Imprecise-input ground truth query for Secondary Science.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Secondary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) with misspelling ("resperation" for
 * respiration). Tests fuzzy matching for common science term misspelling.
 */
export const SCIENCE_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'resperation in humans',
    expectedRelevance: {
      'aerobic-cellular-respiration': 3,
      'anaerobic-cellular-respiration-in-humans': 3,
      'cellular-respiration': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common respiration misspelling - tests fuzzy recovery',
  },
] as const;
