/**
 * Cross-topic ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COOKING_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'energy nutrients and healthy eating',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of nutritional science and practical cooking',
    expectedRelevance: {
      'sources-of-energy-and-nutrients': 3,
      'why-we-need-energy-and-nutrients': 2,
    },
  },
] as const;
