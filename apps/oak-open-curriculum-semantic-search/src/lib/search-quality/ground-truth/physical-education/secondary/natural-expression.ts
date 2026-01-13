/**
 * Natural-expression ground truth query for Secondary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests synonym mapping */
export const PE_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'getting fit exercise programme',
    category: 'natural-expression',
    priority: 'high',
    description: 'Synonym: "getting fit" → fitness, "exercise programme" → training',
    expectedRelevance: {
      'design-your-programme': 3,
      'the-fitt-frequency-intensity-time-and-type-principle': 2,
      'setting-goals-for-training': 2,
    },
  },
] as const;
