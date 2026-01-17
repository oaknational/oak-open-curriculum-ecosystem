/**
 * Natural-expression ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-16 - Tests informal "learning to cook" phrasing for practical cooking lessons */
export const COOKING_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'learning to cook healthy lunches',
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests vocabulary bridging: "learning to cook" → practical cooking skills, "healthy" → health-conscious dishes, "lunches" → lunch-appropriate meals. Score=3 for practical cooking lesson explicitly about healthy lunch. Score=2 for practical cooking lessons that mention healthy eating, or healthy meal planning lessons that address lunch.',
    expectedRelevance: {
      'making-a-healthy-wrap-for-lunch': 3,
      'making-an-international-salad': 2,
      'healthy-meals': 2,
    },
  },
] as const;
