/**
 * PRIMARY Cooking & Nutrition standard ground truth queries.
 *
 * Covers healthy eating, food preparation, and nutrition basics.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * PRIMARY Cooking & Nutrition standard queries.
 */
export const COOKING_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'healthy eating nutrition',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for nutrition units.',
    expectedRelevance: {
      'healthy-meals': 3,
      'why-we-need-energy-and-nutrients': 3,
      'sources-of-energy-and-nutrients': 2,
    },
  },
  {
    query: 'cooking recipes for kids',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher intent for cooking practical lessons.',
    expectedRelevance: {
      'making-rock-cakes': 3,
      'making-spring-rolls': 3,
      'making-veggie-kebabs': 2,
    },
  },
  {
    query: 'food from around the world',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for global foods.',
    expectedRelevance: {
      'food-from-around-the-world': 3,
      'food-from-around-the-uk': 3,
      'familiar-and-unfamiliar-foods-to-me': 2,
    },
  },
  {
    query: 'food production processing',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for food production.',
    expectedRelevance: {
      'producing-our-food': 3,
      'processing-our-food': 3,
    },
  },
] as const;
