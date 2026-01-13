/**
 * Imprecise-input ground truth query for Secondary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - MRR 0.500, tests multiple misspellings (plaits, earthqakes).
 */
export const GEOGRAPHY_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'tectonic plaits and earthqakes',
    expectedRelevance: {
      'the-movement-of-tectonic-plates': 3,
      earthquakes: 3,
      'plate-boundaries': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings - tests fuzzy recovery',
  },
] as const;
