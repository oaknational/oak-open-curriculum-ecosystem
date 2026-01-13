/**
 * Imprecise-input ground truth query for Secondary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "nutrision" misspelling */
export const COOKING_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision healthy food',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of nutrition - tests fuzzy recovery',
    expectedRelevance: {
      'eat-well-now': 3,
      'macronutrients-fibre-and-water': 2,
    },
  },
] as const;
