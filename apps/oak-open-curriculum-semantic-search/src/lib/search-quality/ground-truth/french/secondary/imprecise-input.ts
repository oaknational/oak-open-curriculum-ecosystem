/**
 * Imprecise-input ground truth query for Secondary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "grammer" misspelling */
export const FRENCH_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'french grammer avoir etre',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common grammar misspelling - tests fuzzy recovery',
    expectedRelevance: {
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
  },
] as const;
