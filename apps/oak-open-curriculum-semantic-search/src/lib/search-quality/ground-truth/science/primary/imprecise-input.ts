/**
 * Imprecise-input ground truth query for Primary Science.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Primary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.333 reflects challenge of multiple misspellings
 * ("evoloution" for evolution, "adaptashun" for adaptation).
 * Tests fuzzy matching for common primary-level spelling errors.
 */
export const SCIENCE_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'evoloution and adaptashun',
    expectedRelevance: {
      'evolution-evidence': 3,
      'animal-adaptations': 3,
      'charles-darwin-and-finches': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common primary-level spelling errors - tests fuzzy recovery',
  },
] as const;
