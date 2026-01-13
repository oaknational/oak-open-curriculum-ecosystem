/**
 * Imprecise-input ground truth query for Secondary English.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Secondary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.500 shows reasonable recovery for common misspelling
 * ("frankenstien" for Frankenstein). Tests fuzzy matching for
 * a frequently misspelled literary text title.
 */
export const ENGLISH_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'frankenstien monster creation',
    expectedRelevance: {
      'frankensteins-reaction-to-his-creation': 3,
      'frankenstein-and-the-gothic-context': 3,
      'frankensteins-regret': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common Frankenstein misspelling - tests fuzzy recovery',
  },
] as const;
