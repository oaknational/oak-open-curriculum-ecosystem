/**
 * Imprecise-input ground truth query for Primary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "relegion" misspelling */
export const RE_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'relegion stories primary',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of religion - tests fuzzy recovery',
    expectedRelevance: {
      'shared-stories': 3,
      'noah-and-the-rainbow': 2,
    },
  },
] as const;
