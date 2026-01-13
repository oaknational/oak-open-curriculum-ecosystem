/**
 * Natural-expression ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.167, tests informal e-safety phrasing */
export const COMPUTING_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'staying safe on computers',
    expectedRelevance: {
      'using-information-technology-safely': 3,
      'introduction-to-information-technology': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for e-safety curriculum',
  },
] as const;
