/**
 * Natural-expression ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: replaced score=2 slug with one that mentions "safer" in key learning */
export const COMPUTING_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'staying safe on computers',
    expectedRelevance: {
      'using-information-technology-safely': 3,
      'benefits-of-information-technology': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests vocabulary bridging from informal "staying safe" to curriculum terms. Score=3 is directly about IT safety; score=2 mentions IT makes tasks "safer" in key learning.',
  },
] as const;
