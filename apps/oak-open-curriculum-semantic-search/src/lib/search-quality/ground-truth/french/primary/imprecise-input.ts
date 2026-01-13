/**
 * Imprecise-input ground truth query for Primary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "fench" misspelling */
export const FRENCH_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'fench vocabulary primary',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of French - tests fuzzy recovery',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'my-birthday-quand': 2,
    },
  },
] as const;
