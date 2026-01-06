/**
 * Secondary Cooking & Nutrition ground truth queries for search quality evaluation.
 *
 * Covers KS3: cooking techniques, nutrition, food safety.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/cooking-nutrition-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Secondary Cooking & Nutrition.
 */
export const COOKING_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'making soup Year 7',
    expectedRelevance: {
      'making-leek-and-potato-soup': 3,
      'making-a-mini-deli-salad': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'baking bread focaccia',
    expectedRelevance: {
      'making-herby-focaccia': 3,
      'making-chelsea-buns': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'curry recipe cooking',
    expectedRelevance: {
      'making-sweet-potato-katsu-curry': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Eatwell Guide healthy eating',
    expectedRelevance: {
      'eat-well-now': 3,
      'making-better-food-and-drink-choices': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'macronutrients micronutrients',
    expectedRelevance: {
      'macronutrients-fibre-and-water': 3,
      micronutrients: 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'burrito recipe',
    expectedRelevance: {
      'making-cheesy-bean-burritos': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Secondary Cooking & Nutrition.
 */
export const COOKING_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision healthy food',
    expectedRelevance: {
      'eat-well-now': 2,
      'macronutrients-fibre-and-water': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of nutrition',
  },
  {
    query: 'how to cook healthy meals ks3',
    expectedRelevance: {
      'making-a-mini-deli-salad': 2,
      'making-better-food-and-drink-choices': 2,
    },
    category: 'colloquial',
    description: 'Question format with key stage reference',
  },
] as const;

/**
 * All Secondary Cooking & Nutrition ground truth queries.
 *
 * Total: 8 queries.
 */
export const COOKING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_SECONDARY_STANDARD_QUERIES,
  ...COOKING_SECONDARY_HARD_QUERIES,
] as const;
