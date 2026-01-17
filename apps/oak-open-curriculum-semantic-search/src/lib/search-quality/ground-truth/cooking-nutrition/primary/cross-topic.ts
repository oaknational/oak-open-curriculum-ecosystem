/**
 * Cross-topic ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-16 - Tests intersection of energy + nutrients + healthy eating concepts */
export const COOKING_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'energy nutrients and healthy eating',
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests multi-concept intersection: energy + nutrients + healthy eating. Score=3 for lessons explicitly combining all three (both nutrient lessons reference Eatwell Guide for healthy eating). Score=2 for practical cooking lessons in the "Food for energy and nutrients" unit.',
    expectedRelevance: {
      'sources-of-energy-and-nutrients': 3,
      'why-we-need-energy-and-nutrients': 3,
      'making-curry-in-a-hurry': 2,
    },
  },
] as const;
