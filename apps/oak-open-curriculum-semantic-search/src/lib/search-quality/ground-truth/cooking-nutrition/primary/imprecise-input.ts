/**
 * Imprecise-input ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-16 - Tests search resilience to typos "nutrision" and "helthy" */
export const COOKING_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision and helthy food',
    category: 'imprecise-input',
    priority: 'critical',
    description:
      'Tests resilience: typos "nutrision" (nutrition) and "helthy" (healthy). Expected slugs match semantic intent of "nutrition and healthy food". ES fuzzy handles "helthy"→"healthy" well; "nutrision" relies on ELSER semantics. Score=3 for nutrition-focused lessons, score=2 for healthy eating application.',
    expectedRelevance: {
      'why-we-need-energy-and-nutrients': 3,
      'sources-of-energy-and-nutrients': 3,
      'food-labels-for-health': 3,
      'healthy-meals': 2,
      'health-and-wellbeing': 2,
    },
  },
] as const;
