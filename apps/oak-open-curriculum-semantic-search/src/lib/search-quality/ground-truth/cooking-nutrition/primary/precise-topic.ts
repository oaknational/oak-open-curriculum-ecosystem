/**
 * Precise-topic ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COOKING_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'healthy eating nutrition',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for nutrition units',
    expectedRelevance: {
      'healthy-meals': 3,
      'why-we-need-energy-and-nutrients': 3,
      'sources-of-energy-and-nutrients': 2,
    },
  },
] as const;
