/**
 * Imprecise-input ground truth query for Secondary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "grammer" misspelling */
export const SPANISH_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'spanish grammer conjugating verbs',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common grammar misspelling - tests fuzzy recovery',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
    },
  },
] as const;
