/**
 * Imprecise-input ground truth query for Primary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - MRR 0.500, tests "ilands" misspelling of islands.
 */
export const GEOGRAPHY_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'british ilands map',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 3,
      'the-countries-and-capital-cities-of-the-uk': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of islands - tests fuzzy recovery',
  },
] as const;
