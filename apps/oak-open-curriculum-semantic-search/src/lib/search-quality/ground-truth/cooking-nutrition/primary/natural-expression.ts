/**
 * Natural-expression ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests informal phrasing */
export const COOKING_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'learning to cook healthy lunches',
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for practical cooking skills',
    expectedRelevance: {
      'making-a-healthy-wrap-for-lunch': 3,
      'healthy-meals': 2,
    },
  },
] as const;
