/**
 * Imprecise-input ground truth query for Primary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "footbal" misspelling */
export const PE_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'footbal skills primary',
    expectedRelevance: {
      'dribbling-and-keeping-control': 3,
      'passing-and-receiving-skills': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of football - tests fuzzy recovery',
  },
] as const;
