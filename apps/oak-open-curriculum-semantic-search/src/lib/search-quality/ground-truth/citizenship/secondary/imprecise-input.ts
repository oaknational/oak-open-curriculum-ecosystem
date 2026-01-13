/**
 * Imprecise-input ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "goverment" misspelling */
export const CITIZENSHIP_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'UK goverment parliament democracy',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "government" - tests fuzzy recovery',
    expectedRelevance: {
      'how-is-the-uk-government-organised': 3,
      'what-is-the-difference-between-the-government-and-parliament': 3,
      'how-is-local-government-different-to-central-government': 2,
    },
  },
] as const;
