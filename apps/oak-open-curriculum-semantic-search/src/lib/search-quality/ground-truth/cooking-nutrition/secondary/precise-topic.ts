/**
 * Precise-topic ground truth query for Secondary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COOKING_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'macronutrients and micronutrients nutrition',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests scientific nutrition vocabulary retrieval',
    expectedRelevance: {
      'macronutrients-fibre-and-water': 3,
      micronutrients: 2,
    },
  },
] as const;
