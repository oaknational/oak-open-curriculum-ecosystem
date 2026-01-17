/**
 * Precise-topic ground truth query for Primary Cooking & Nutrition.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-16 - Updated to include foundational healthy eating and nutrition lessons */
export const COOKING_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'healthy eating nutrition',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests curriculum terminology for healthy eating and nutrition. Score=3 for foundational lessons about nutrition concepts or the Eatwell Guide framework. Score=2 for practical application lessons.',
    expectedRelevance: {
      'why-we-need-energy-and-nutrients': 3,
      'sources-of-energy-and-nutrients': 3,
      'introducing-the-eatwell-guide': 3,
      'health-and-wellbeing': 2,
      'healthy-meals': 2,
    },
  },
] as const;
