/**
 * Imprecise-input ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "nutrision" and "helthy" misspellings */
export const COOKING_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision and helthy food',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings of "nutrition" and "healthy" - tests fuzzy recovery',
    expectedRelevance: {
      'why-we-need-energy-and-nutrients': 3,
      'healthy-meals': 2,
    },
  },
] as const;
