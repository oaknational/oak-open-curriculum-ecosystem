/**
 * Imprecise-input ground truth query for Secondary History.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000) with "holocost" misspelling.
 */
export const HISTORY_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'holocost and nazi germany',
    expectedRelevance: {
      'the-holocaust-in-context': 3,
      'nazi-persecution-of-jewish-people': 3,
      'ghettos-and-the-final-solution': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common Holocaust misspelling - tests fuzzy recovery',
  },
] as const;
