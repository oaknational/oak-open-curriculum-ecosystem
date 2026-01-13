/**
 * Cross-topic ground truth query for Secondary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests nutrition + cooking intersection */
export const COOKING_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'nutrition and cooking techniques together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of nutrition theory with practical cooking skills',
    expectedRelevance: {
      'eat-well-now': 3,
      'making-better-food-and-drink-choices': 2,
    },
  },
] as const;
