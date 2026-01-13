/**
 * Natural-expression ground truth query for Secondary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher intent phrasing */
export const COOKING_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach students to make bread',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent phrasing for baking lessons',
    expectedRelevance: {
      'making-herby-focaccia': 3,
      'making-chelsea-buns': 2,
    },
  },
] as const;
