/**
 * Imprecise-input ground truth query for Primary History.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Primary History.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.000 reflects challenge of misspelling ("vikins" for Vikings).
 * This is a known difficult case that tests fuzzy matching limits.
 * Keeping to track improvement opportunities.
 */
export const HISTORY_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'vikins and anglo saxons',
    expectedRelevance: {
      'early-viking-raids': 3,
      'why-the-vikings-came-to-britain': 3,
      'the-anglo-saxon-fightback': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common Vikings misspelling - tests fuzzy recovery limits',
  },
] as const;
